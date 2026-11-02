<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { haptic } from '../../lib/haptics';
import { cn } from '../../lib/utils';

// What the indicator gets: how far the pull went (1 at the threshold), and the state
export type PullToRefreshState = 'idle' | 'pulling' | 'ready' | 'refreshing';

// Props
const props = withDefaults(defineProps<{
	refresh?: (() => Promise<unknown> | unknown) | null; // Reloads the data of the page (nothing happens without it)
	threshold?: number; // Pixels of pull that trigger the refresh (the page moves half as much as the finger)
	minDuration?: number; // Milliseconds the indicator stays at least, so a quick refresh doesn't just flicker
	installedOnly?: boolean; // Only in the installed app (a browser tab has its own pull to refresh, which reloads the page)
	class?: HTMLAttributes['class'];
}>(), {
	refresh: null,
	threshold: 72,
	minDuration: 600,
	installedOnly: true
});

const { t } = useI18n();

// Where the gesture is
const distance = ref(0); // How far the page moved down
const state = ref<PullToRefreshState>('idle');
const settling = ref(false); // The page slides back (animated), instead of following the finger
const progress = computed(() => distance.value / props.threshold);
const enabled = ref(false);

// The touch being followed: where it started, and whether it's a vertical pull (null until it moved enough to tell)
let startX = 0;
let startY = 0;
let vertical: boolean | null = null;
let tracking = false;

// The page moves half as much as the finger, and a bit less past the threshold
const resist = (pull: number) => {
	const half = pull / 2;
	return half <= props.threshold ? half : props.threshold + (half - props.threshold) / 3;
};

// A touch starts: follow it when the page is at the very top and nothing is refreshing
const handleTouchStart = (event: TouchEvent) => {
	if (!enabled.value || !props.refresh || state.value === 'refreshing' || window.scrollY > 0 || event.touches.length !== 1) return;
	startX = event.touches[0]!.clientX;
	startY = event.touches[0]!.clientY;
	vertical = null;
	tracking = true;
	settling.value = false;
};

// The finger moves: a downward pull moves the page and the indicator (a sideways swipe, a carousel for example, is left alone)
const handleTouchMove = (event: TouchEvent) => {
	if (!tracking) return;
	const dx = event.touches[0]!.clientX - startX;
	const dy = event.touches[0]!.clientY - startY;
	if (vertical === null) {
		if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
		vertical = Math.abs(dy) > Math.abs(dx) && dy > 0;
		if (!vertical) { tracking = false; return; }
	}
	if (dy <= 0 || window.scrollY > 0) {
		distance.value = 0;
		state.value = 'idle';
		return;
	}
	event.preventDefault(); // The page doesn't scroll or bounce while it's pulled
	distance.value = resist(dy);
	const ready = distance.value >= props.threshold;
	if (ready && state.value !== 'ready') haptic('tap'); // Felt when releasing would refresh
	state.value = ready ? 'ready' : 'pulling';
};

// The finger lifts: refresh past the threshold (the page waits at it until the data is back), or slide back
const handleTouchEnd = async () => {
	if (!tracking) return;
	tracking = false;
	settling.value = true;
	if (state.value !== 'ready') {
		distance.value = 0;
		state.value = 'idle';
		return;
	}
	state.value = 'refreshing';
	distance.value = props.threshold;
	try {
		await Promise.all([props.refresh?.(), new Promise(resolve => setTimeout(resolve, props.minDuration))]);
	} finally {
		distance.value = 0;
		state.value = 'idle';
	}
};

// Only on a touch screen, and only in the installed app unless asked otherwise
onMounted(() => {
	const touch = window.matchMedia('(pointer: coarse)').matches;
	const installed = window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
	enabled.value = touch && (installed || !props.installedOnly);
	if (!enabled.value) return;
	window.addEventListener('touchstart', handleTouchStart, { passive: true });
	window.addEventListener('touchmove', handleTouchMove, { passive: false });
	window.addEventListener('touchend', handleTouchEnd, { passive: true });
	window.addEventListener('touchcancel', handleTouchEnd, { passive: true });
});
onBeforeUnmount(() => {
	window.removeEventListener('touchstart', handleTouchStart);
	window.removeEventListener('touchmove', handleTouchMove);
	window.removeEventListener('touchend', handleTouchEnd);
	window.removeEventListener('touchcancel', handleTouchEnd);
});

// The arc of the default spinner: it grows with the pull, then spins
const ARC = 2 * Math.PI * 9;
const arc = computed(() => (state.value === 'refreshing' ? ARC * 0.7 : ARC * Math.min(progress.value, 1) * 0.85));
</script>

<template>
	<!-- The page, which slides down while it's pulled, with the indicator in the space it leaves at the top -->
	<div data-slot="pull-to-refresh" :data-state="state" :class="cn('relative', props.class)">
		<!-- Indicator (the app's own in the slot, or a spinner), announced to screen readers while refreshing -->
		<div v-if="enabled" aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-center overflow-hidden" :class="settling && 'transition-[height] duration-300 ease-out-expo'" :style="{ height: `${distance}px` }">
			<slot name="indicator" :progress="progress" :state="state">
				<span class="flex size-10 items-center justify-center rounded-full border border-border bg-card shadow-elevated-md" :style="{ opacity: Math.min(1, progress * 1.6), rotate: state === 'refreshing' ? undefined : `${progress * 270}deg` }">
					<svg viewBox="0 0 24 24" class="size-5.5" :class="state === 'refreshing' && 'animate-spin'">
						<circle cx="12" cy="12" r="9" fill="none" stroke-width="2.5" stroke-linecap="round" class="stroke-primary" :stroke-dasharray="`${arc} ${ARC}`" transform="rotate(-90 12 12)" />
					</svg>
				</span>
			</slot>
		</div>
		<span v-if="state === 'refreshing'" role="status" class="sr-only">{{ t('uiVintage.common.loading.title') }}</span>

		<!-- Content -->
		<div data-slot="pull-to-refresh-content" :class="settling && 'transition-[translate] duration-300 ease-out-expo'" :style="distance ? { translate: `0 ${distance}px` } : undefined">
			<slot />
		</div>
	</div>
</template>