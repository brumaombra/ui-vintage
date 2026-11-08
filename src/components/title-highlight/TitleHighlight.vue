<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { cn } from '../../lib/utils';

// Props
const props = withDefaults(defineProps<{
	/** How long after the words scroll into view the underline draws itself in (e.g. '600ms'); without it the underline is simply there */
	drawDelay?: string;
	/** @default 'md' */
	size?: 'sm' | 'md'; // md under a title, sm under body text
	class?: HTMLAttributes['class'];
}>(), {
	drawDelay: '',
	size: 'md'
});

// Whether the words have scrolled into view (the drawing starts then)
const rootRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
let observer: IntersectionObserver | null = null;

// The state of the underline, for styling and tests: still (no drawing), waiting to be seen, or drawing (then drawn)
const state = computed(() => !props.drawDelay ? 'still' : isVisible.value ? 'drawing' : 'waiting');

// Start drawing once at least half of the words are on screen
onMounted(() => {
	if (!props.drawDelay) return;
	if (typeof IntersectionObserver === 'undefined') {
		isVisible.value = true;
		return;
	}
	observer = new IntersectionObserver(entries => {
		if (!entries.some(entry => entry.isIntersecting)) return;
		isVisible.value = true;
		observer?.disconnect();
	}, { threshold: 0.5 });
	if (rootRef.value) observer.observe(rootRef.value);
});

// Stop watching when the words go away
onBeforeUnmount(() => {
	observer?.disconnect();
});
</script>

<template>
	<!-- Highlighted words of a title: the text keeps its color and a bold hand-drawn underline carries the brand orange (orange text is only 2.2:1 on a light background) -->
	<!-- The text and the underline sit on one line so no stray space ends up inside the highlight. The underline is hidden to be drawn only where scripts run and motion is welcome, so without JavaScript it is simply there -->
	<span ref="rootRef" data-slot="title-highlight" :data-state="state" :class="cn('relative inline-block', props.class)"><slot /><svg :class="cn('pointer-events-none absolute left-0 w-full text-primary', props.size === 'sm' ? '-bottom-1.5 h-2.5' : '-bottom-2.5 h-4')" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" aria-hidden="true">
			<path d="M2 9C40 3 80 2 198 7" stroke="currentColor" stroke-width="6" stroke-linecap="round" pathLength="1" :class="cn('[stroke-dasharray:1_2]', props.drawDelay && 'motion-safe:[@media(scripting:enabled)]:[stroke-dashoffset:1]', state === 'drawing' && 'motion-safe:animate-uv-draw')" :style="props.drawDelay ? { animationDelay: props.drawDelay } : undefined" />
		</svg></span>
</template>