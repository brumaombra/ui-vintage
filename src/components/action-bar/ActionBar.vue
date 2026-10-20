<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../lib/utils';

// Props (a row of buttons on desktop; on mobile a full-width bar of equal tiles with the icon above the label, like an app)
const props = defineProps<{
	class?: HTMLAttributes['class'];
}>();
</script>

<template>
	<div data-slot="action-bar" :class="cn('action-bar grid w-full auto-cols-fr grid-flow-col gap-2 md:flex md:w-auto md:flex-wrap md:items-center md:gap-3', props.class)">
		<slot />
	</div>
</template>

<style scoped>
/* Mobile tiles: icon above a short label, filling the bar */
@media (width < 48rem) {
	.action-bar > :slotted([data-slot="button"]) {
		height: auto;
		width: auto;
		flex-direction: column;
		gap: 0.375rem;
		padding: 0.75rem 0.25rem;
		font-size: 0.6875rem;
		line-height: 1.2;
		white-space: normal;
		text-align: center;
	}

	/* Same icon size on every tile */
	.action-bar > :slotted([data-slot="button"]) svg {
		width: 1.125rem;
		height: 1.125rem;
	}
}
</style>