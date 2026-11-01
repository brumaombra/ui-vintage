<script setup lang="ts">
import Wifi01Icon from '@hugeicons/core-free-icons/Wifi01Icon';
import WifiDisconnected02Icon from '@hugeicons/core-free-icons/WifiDisconnected02Icon';
import { HugeiconsIcon } from '@hugeicons/vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { getUiVintageRuntimeMessage } from '../../lib/i18n';

// How long "Back online" stays before the pill hides
const BACK_ONLINE_MS = 2500;

// What the pill shows: nothing, the lost connection, or the connection that just came back
const status = ref<'hidden' | 'offline' | 'online'>('hidden');
let hideTimer: ReturnType<typeof setTimeout> | null = null;

// Texts of the pill, in the language of the app
const label = computed(() => status.value === 'online'
	? getUiVintageRuntimeMessage('uiVintage.pwa.status.online', 'Back online')
	: getUiVintageRuntimeMessage('uiVintage.pwa.status.offline', "You're offline"));

// The connection dropped: show it until it's back
const showOffline = () => {
	if (hideTimer) clearTimeout(hideTimer);
	status.value = 'offline';
};

// The connection is back: say so for a moment, only when the pill was showing it was lost
const showOnline = () => {
	if (status.value !== 'offline') return;
	status.value = 'online';
	hideTimer = setTimeout(() => { status.value = 'hidden'; }, BACK_ONLINE_MS);
};

// Follow the connection of the browser (and start offline when the page opened without one)
onMounted(() => {
	window.addEventListener('offline', showOffline);
	window.addEventListener('online', showOnline);
	if (!navigator.onLine) showOffline();
});
onBeforeUnmount(() => {
	window.removeEventListener('offline', showOffline);
	window.removeEventListener('online', showOnline);
	if (hideTimer) clearTimeout(hideTimer);
});
</script>

<template>
	<!-- Connection pill: at the top center, under the notch, above the page and its dialogs (announced to screen readers) -->
	<div data-slot="offline-indicator" role="status" aria-live="polite" class="pointer-events-none fixed inset-x-0 top-0 z-[80] flex justify-center px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
		<Transition enter-active-class="transition-[opacity,translate] duration-300 ease-out-expo" enter-from-class="-translate-y-3 opacity-0" leave-active-class="transition-[opacity,translate] duration-200 ease-in" leave-to-class="-translate-y-3 opacity-0">
			<!-- Pill -->
			<div v-if="status !== 'hidden'" :data-status="status" class="inline-flex items-center gap-2 rounded border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-elevated-md">
				<HugeiconsIcon :icon="status === 'online' ? Wifi01Icon : WifiDisconnected02Icon" :class="status === 'online' ? 'text-success' : 'text-warning'" class="size-4 shrink-0" aria-hidden="true" />
				<span>{{ label }}</span>
			</div>
		</Transition>
	</div>
</template>