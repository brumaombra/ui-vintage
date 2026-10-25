<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { getInteractiveSurfaceToneClasses, getSurfaceToneClasses, type ToneColor } from '../../../lib/color-tokens';
import { cn } from '../../../lib/utils';
import type { HugeiconsIconDefinition } from '../../../lib/common-types';

// Props
const props = withDefaults(defineProps<{
	text: string;
	icon?: HugeiconsIconDefinition | null;
	color?: ToneColor | 'primary';
	dot?: boolean;
	pulse?: boolean;
	interactive?: boolean;
	class?: HTMLAttributes['class'];
}>(), {
	icon: null,
	color: 'gray',
	dot: false,
	pulse: false,
	interactive: false
});

// Surface of the badge: a tone, or for primary a neutral badge with dark text, whose dot and icon carry the brand orange (orange text on its tint is only 2.1:1)
const colorClasses = computed(() => props.color === 'primary' ? 'border border-border bg-surface text-foreground' : getSurfaceToneClasses(props.color));

// Color of the dot and the icon: the brand orange for primary, the text color otherwise
const accentClass = computed(() => props.color === 'primary' ? 'bg-primary text-primary' : 'bg-current');

// Hover of a badge used as a link: it lifts and tints like the cards (a gray badge takes the primary tint, a tone badge its stronger tone; the tints are solid, so the page grid never shows through)
const interactiveClasses = computed(() => {
	if (!props.interactive) return '';
	const tint = props.color === 'gray'
		? 'hover:border-primary/40 hover:bg-[color-mix(in_oklab,var(--primary)_10%,var(--surface))]'
		: props.color === 'primary'
			? 'hover:border-primary/50 hover:bg-[color-mix(in_oklab,var(--primary)_15%,var(--card))]'
			: getInteractiveSurfaceToneClasses(props.color);
	return `cursor-pointer transition-[translate,color,background-color,border-color] duration-200 ease-out-expo hover:-translate-y-0.5 ${tint}`;
});
</script>

<template>
	<span data-slot="badge" :class="cn('inline-flex w-fit items-center justify-center gap-1.5 whitespace-nowrap rounded border px-2 py-0.5 text-xs font-semibold transition-colors duration-150', colorClasses, interactiveClasses, props.class)">
		<!-- Status dot -->
		<span v-if="props.dot || props.pulse" class="relative flex size-1.5 shrink-0">
			<span v-if="props.pulse" :class="['absolute inset-0 animate-uv-ping-soft rounded-full', accentClass]" />
			<span :class="['relative size-1.5 rounded-full', accentClass]" />
		</span>

		<!-- Icon -->
		<HugeiconsIcon v-if="props.icon" :icon="props.icon" :class="['size-3.5 shrink-0', props.color === 'primary' && 'text-primary']" :stroke-width="1.8" />
		{{ props.text }}
	</span>
</template>