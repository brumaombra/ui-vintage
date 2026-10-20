<script setup lang="ts">
import { computed } from 'vue';
import type { HTMLAttributes } from 'vue';
import {
	getSurfaceToneClasses,
	type ToneColor,
} from '../../../lib/color-tokens';
import { cn } from '../../../lib/utils';

type CardColor = 'default' | ToneColor;
type CardPadding = 'default' | 'none';
type CardElevation = 'none' | 'sm' | 'md' | 'lg' | 'xl';

// Props
const props = withDefaults(defineProps<{
	color?: CardColor;
	padding?: CardPadding;
	elevation?: CardElevation;
	interactive?: boolean;
	class?: HTMLAttributes['class'];
}>(), {
	padding: 'default',
	interactive: false
});

// Shadow per elevation level
const elevationClasses: Record<CardElevation, string> = {
	none: 'shadow-none',
	sm: 'shadow-elevated-sm',
	md: 'shadow-elevated-md',
	lg: 'shadow-elevated-lg',
	xl: 'shadow-elevated-xl'
};

// Inner spacing: the default fits CardHeader / CardContent / CardFooter, none is for cards that lay out their own sections edge to edge (clipped to the corners)
const paddingClasses: Record<CardPadding, string> = {
	default: 'gap-4 sm:gap-6 py-6',
	none: 'gap-0 overflow-hidden'
};

// Get the appropriate classes
const colorClasses = computed(() => {
	// If color is not specified or is "default", use the default card styles
	if (!props.color || props.color === 'default') {
		return 'border border-border bg-card text-card-foreground shadow-elevated-sm';
	}

	// For other colors, use the corresponding surface tone classes
	return getSurfaceToneClasses(props.color);
});
</script>

<template>
	<div data-slot="card" :data-interactive="props.interactive ? '' : undefined" :class="cn(
		'relative flex flex-col rounded transition-[border-color,box-shadow,background-color,translate] duration-300 ease-out-expo',
		paddingClasses[props.padding],
		// A CardMedia as first child bleeds to the top edge, clipped to the corners
		'has-[>[data-slot=card-media]:first-child]:overflow-hidden has-[>[data-slot=card-media]:first-child]:pt-0',
		colorClasses,
		props.elevation && elevationClasses[props.elevation],
		props.interactive && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-elevated-md active:translate-y-0 active:duration-100',
		props.class,
	)">
		<slot />
	</div>
</template>