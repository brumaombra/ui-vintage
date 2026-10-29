<script setup lang="ts">
import { computed } from 'vue';
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';

// Props (text: a line of text, sitting on the line of the surrounding text size, so it is as tall as the text it stands for; size its width with a class)
const props = withDefaults(defineProps<{
	circle?: boolean;
	text?: boolean;
	class?: HTMLAttributes['class'];
}>(), {
	circle: false,
	text: false
});

// Shape: a circle, a line of text (a span, so it can sit inside a paragraph; far thinner than any component, so half the corner radius keeps it as square as them), or a block with the corner of every component
const shapeClass = computed(() => {
	if (props.circle) return 'rounded-full';
	return props.text ? 'inline-block h-[0.8em] w-full align-middle rounded-[calc(var(--uv-radius)/2)]' : 'rounded';
});
</script>

<template>
	<component :is="props.text ? 'span' : 'div'" data-slot="skeleton" :class="cn(
		'relative overflow-hidden border border-border bg-surface',
		shapeClass,
		'after:absolute after:inset-0 after:animate-uv-shimmer after:bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--foreground)_6%,transparent),transparent)]',
		props.class
	)" />
</template>