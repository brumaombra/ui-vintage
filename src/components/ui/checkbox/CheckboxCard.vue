<script setup lang="ts">
import type { CheckboxRootEmits, CheckboxRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { HugeiconsIcon } from '@hugeicons/vue';
import { CheckboxIndicator, CheckboxRoot, useForwardPropsEmits } from 'reka-ui';
import type { HugeiconsIconDefinition } from '../../../lib/common-types';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<CheckboxRootProps & {
	label: string;
	description?: string;
	icon?: HugeiconsIconDefinition;
	class?: HTMLAttributes['class'];
}>();

// Emits
const emits = defineEmits<CheckboxRootEmits>();

const delegatedProps = reactiveOmit(props, 'class', 'label', 'description', 'icon');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
	<CheckboxRoot data-slot="checkbox-card" v-bind="forwarded" :class="cn(
		'group/checkbox-card relative flex w-full cursor-pointer items-center gap-3 rounded border border-border bg-card px-4 py-3 text-left shadow-elevated-sm outline-none',
		'[transition:scale_320ms_var(--ease-spring),border-color_150ms_var(--ease-snappy),background-color_150ms_var(--ease-snappy),box-shadow_200ms_var(--ease-snappy)]',
		'hover:border-border-strong active:scale-[0.985] focus-visible:ring-[3px] focus-visible:ring-ring/45',
		'data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 data-[state=checked]:hover:border-primary',
		'disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100',
		props.class
	)">
		<!-- Leading visual: the app's own through the icon slot (an avatar, a flag, a logo), centered in the same 36px as the icon tile so every card has the same height, or the icon prop in a tile -->
		<span v-if="$slots.icon" class="flex size-9 shrink-0 items-center justify-center">
			<slot name="icon" />
		</span>
		<span v-else-if="props.icon" class="flex size-9 shrink-0 items-center justify-center rounded border border-border bg-surface text-muted-foreground transition-colors duration-150 group-data-[state=checked]/checkbox-card:border-primary/40 group-data-[state=checked]/checkbox-card:bg-primary/10 group-data-[state=checked]/checkbox-card:text-primary">
			<HugeiconsIcon :icon="props.icon" class="size-4.5" />
		</span>

		<!-- Label and description -->
		<span class="flex min-w-0 flex-1 flex-col gap-0.5">
			<span class="text-xs font-semibold text-foreground sm:text-sm">
				<slot name="label">{{ props.label }}</slot>
			</span>
			<span v-if="props.description || $slots.description" class="text-xs text-muted-foreground">
				<slot name="description">{{ props.description }}</slot>
			</span>
		</span>

		<!-- Checkbox square (the same look as Checkbox, drawn inside the card since the whole card is the control) -->
		<span aria-hidden="true" :class="cn(
			'flex size-5 shrink-0 items-center justify-center rounded border border-input bg-secondary text-primary-foreground shadow-elevated-sm',
			'[transition:background-color_150ms_var(--ease-snappy),border-color_150ms_var(--ease-snappy)]',
			'group-data-[state=checked]/checkbox-card:border-primary group-data-[state=checked]/checkbox-card:bg-primary'
		)">
			<CheckboxIndicator force-mount data-slot="checkbox-card-indicator" class="pointer-events-none flex size-full items-center justify-center">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="size-3.5">
					<!-- Check mark: draws itself via stroke-dashoffset -->
					<path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1" :class="cn(
						'opacity-0 [stroke-dasharray:1_2] [stroke-dashoffset:1] [transition:stroke-dashoffset_120ms_var(--ease-snappy),opacity_90ms_var(--ease-snappy)_30ms]',
						'group-data-[state=checked]/checkbox-card:opacity-100 group-data-[state=checked]/checkbox-card:[stroke-dashoffset:0] group-data-[state=checked]/checkbox-card:[transition:stroke-dashoffset_380ms_var(--ease-out-expo)_40ms,opacity_60ms_linear_40ms]'
					)" />
				</svg>
			</CheckboxIndicator>
		</span>
	</CheckboxRoot>
</template>