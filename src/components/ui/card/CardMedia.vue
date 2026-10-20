<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';

// Props (edge-to-edge media, like an image or a chart: as the first child of a Card it bleeds to the top edge)
const props = defineProps<{
	class?: HTMLAttributes['class'];
}>();
</script>

<template>
	<div data-slot="card-media" :class="cn('overflow-hidden', props.class)">
		<slot />
	</div>
</template>