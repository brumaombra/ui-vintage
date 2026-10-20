<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';

// Props
const props = withDefaults(defineProps<{
	circle?: boolean;
	class?: HTMLAttributes['class'];
}>(), {
	circle: false
});
</script>

<template>
	<div data-slot="skeleton" :class="cn(
		'relative overflow-hidden border border-border bg-surface',
		props.circle ? 'rounded-full' : 'rounded',
		'after:absolute after:inset-0 after:animate-uv-shimmer after:bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--foreground)_6%,transparent),transparent)]',
		props.class
	)" />
</template>