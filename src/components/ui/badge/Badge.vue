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

// Surface of the badge: a tone, or a soft primary tint (for highlights like a category)
const colorClasses = computed(() => props.color === 'primary' ? 'border border-primary/30 bg-primary/10 text-primary' : getSurfaceToneClasses(props.color));

// Hover of a badge used as a link: it lifts and tints like the cards (a gray badge takes the primary tint, a tone badge its stronger tone)
const interactiveClasses = computed(() => {
	if (!props.interactive) return '';
	const tint = props.color === 'gray'
		? 'hover:border-primary/40 hover:bg-primary/10 hover:text-primary'
		: props.color === 'primary'
			? 'hover:border-primary/50 hover:bg-primary/15'
			: getInteractiveSurfaceToneClasses(props.color);
	return `cursor-pointer transition-[translate,color,background-color,border-color] duration-200 ease-out-expo hover:-translate-y-0.5 ${tint}`;
});
</script>

<template>
	<span data-slot="badge" :class="cn('inline-flex w-fit items-center justify-center gap-1.5 whitespace-nowrap rounded border px-2 py-0.5 text-xs font-semibold transition-colors duration-150', colorClasses, interactiveClasses, props.class)">
		<!-- Status dot -->
		<span v-if="props.dot || props.pulse" class="relative flex size-1.5 shrink-0">
			<span v-if="props.pulse" class="absolute inset-0 animate-uv-ping-soft rounded-full bg-current" />
			<span class="relative size-1.5 rounded-full bg-current" />
		</span>

		<!-- Icon -->
		<HugeiconsIcon v-if="props.icon" :icon="props.icon" class="size-3.5 shrink-0" :stroke-width="1.8" />
		{{ props.text }}
	</span>
</template>