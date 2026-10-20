<script setup lang="ts">
import type { AvatarFallbackProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { AvatarFallback } from 'reka-ui';
import { computed, inject } from 'vue';
import { cn } from '../../../lib/utils';
import { avatarContextKey, avatarShapeClasses, avatarTextClasses, getInitials } from '.';

// Props (auto tints the initials with a stable color picked from the name, primary uses the brand color, for example for the current user)
const props = withDefaults(defineProps<AvatarFallbackProps & {
	name?: string;
	color?: 'neutral' | 'auto' | 'primary';
	class?: HTMLAttributes['class'];
}>(), {
	color: 'neutral'
});

const delegatedProps = reactiveOmit(props, 'class', 'name', 'color');

// Tints built on the chart tokens, so they adapt to the theme (the text is mixed with the foreground, so it stays readable on the tint in both themes)
const autoColorClasses = [
	'bg-[color-mix(in_oklab,var(--chart-1)_22%,var(--card))] text-[color-mix(in_oklab,var(--chart-1)_45%,var(--foreground))]',
	'bg-[color-mix(in_oklab,var(--chart-2)_22%,var(--card))] text-[color-mix(in_oklab,var(--chart-2)_45%,var(--foreground))]',
	'bg-[color-mix(in_oklab,var(--chart-3)_22%,var(--card))] text-[color-mix(in_oklab,var(--chart-3)_45%,var(--foreground))]',
	'bg-[color-mix(in_oklab,var(--chart-4)_22%,var(--card))] text-[color-mix(in_oklab,var(--chart-4)_45%,var(--foreground))]',
	'bg-[color-mix(in_oklab,var(--chart-5)_22%,var(--card))] text-[color-mix(in_oklab,var(--chart-5)_45%,var(--foreground))]'
];

// Surface and text color (the same name always gets the same tint)
const colorClass = computed(() => {
	if (props.color === 'primary') return 'bg-primary text-primary-foreground';
	if (props.color !== 'auto') return 'bg-surface text-muted-foreground';
	const hash = [...(props.name ?? '')].reduce((total, character) => total + character.charCodeAt(0), 0);
	return autoColorClasses[hash % autoColorClasses.length];
});

// Size and shape come from the parent avatar
const context = inject(avatarContextKey, null);
const textClass = computed(() => avatarTextClasses[context?.size.value ?? 'md']);
const shapeClass = computed(() => avatarShapeClasses[context?.shape.value ?? 'circle']);

// Initials computed from the name prop
const initials = computed(() => getInitials(props.name));
</script>

<template>
	<!-- With a name the initials act as an image of the person, so screen readers announce the name instead of the letters -->
	<AvatarFallback data-slot="avatar-fallback" v-bind="delegatedProps" :role="props.name ? 'img' : undefined" :aria-label="props.name || undefined" :class="cn('flex size-full items-center justify-center font-semibold uppercase', colorClass, textClass, shapeClass, props.class)">
		<slot>{{ initials }}</slot>
	</AvatarFallback>
</template>