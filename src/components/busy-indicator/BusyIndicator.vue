<script setup lang="ts">
import { Busy } from '../ui/busy';
import { Spinner } from '../ui/spinner';
import { busyIndicatorState } from './busy-indicator-state';
</script>

<template>
	<!-- Whole screen: the mark (or the spinner) and the label, over everything -->
	<Transition v-if="busyIndicatorState.variant === 'fullscreen'" name="uv-busy-screen">
		<div v-if="busyIndicatorState.show" data-slot="busy-screen" role="status" aria-live="polite" aria-busy="true" :class="['fixed inset-0 z-[70] flex flex-col items-center justify-center gap-6 bg-background px-6 text-center', busyIndicatorState.overlayClass]">
			<component :is="busyIndicatorState.mark" v-if="busyIndicatorState.mark" aria-hidden="true" />
			<Spinner v-else size="xl" aria-hidden="true" class="text-primary" />
			<span data-slot="busy-label" :class="['font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground', busyIndicatorState.class]">{{ busyIndicatorState.label }}</span>
		</div>
	</Transition>

	<!-- Card over the dimmed page -->
	<Busy v-else
		:show="busyIndicatorState.show"
		:label="busyIndicatorState.label"
		:class="busyIndicatorState.class"
		:overlay-class="busyIndicatorState.overlayClass"
	/>
</template>

<style scoped>
/* The screen fades in and out, the content rises a little */
.uv-busy-screen-enter-active {
	transition: opacity 0.3s var(--ease-out-expo);
}

.uv-busy-screen-leave-active {
	transition: opacity 0.25s var(--ease-snappy);
}

.uv-busy-screen-enter-from,
.uv-busy-screen-leave-to {
	opacity: 0;
}

.uv-busy-screen-enter-active > * {
	transition: translate 0.5s var(--ease-spring);
}

.uv-busy-screen-enter-from > * {
	translate: 0 8px;
}
</style>