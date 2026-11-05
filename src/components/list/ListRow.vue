<script setup lang="ts">
import { NuxtLinkLocale } from '#components';
import { computed } from 'vue';
import type { HTMLAttributes } from 'vue';
import ArrowRight01Icon from '@hugeicons/core-free-icons/ArrowRight01Icon';
import { HugeiconsIcon } from '@hugeicons/vue';
import { cn } from '../../lib/utils';
import type { HugeiconsIconDefinition } from '../../lib/common-types';

// Props (a row is a link with `to`, a button with `action`, or a plain row holding its own control in the trailing slot or under its label in the default slot)
const props = withDefaults(defineProps<{
	label: string;
	description?: string; // A second line under the label
	icon?: HugeiconsIconDefinition | null;
	iconTile?: boolean; // The icon in a tinted tile (pages), or plain (settings)
	value?: string; // Current value, on the right
	wrapValue?: boolean; // Let a long value (an address, a name) wrap instead of being cut off
	badge?: number; // Count on the right (e.g. unread items)
	to?: string; // Localized path of the page it opens
	action?: boolean; // A button: it emits click
	danger?: boolean;
	labelFor?: string; // Id of the control in the trailing slot, so a tap on the label reaches it
	class?: HTMLAttributes['class'];
}>(), {
	description: '',
	icon: null,
	iconTile: false,
	value: '',
	wrapValue: false,
	badge: 0,
	to: '',
	action: false,
	danger: false,
	labelFor: ''
});

// Emits
const emits = defineEmits<{
	click: [];
}>();

// Element of the row
const rowComponent = computed(() => {
	if (props.to) return NuxtLinkLocale;
	return props.action ? 'button' : 'div';
});

// Rows that open something show a chevron and react to a tap
const isInteractive = computed(() => !!props.to || props.action);

// Handle a tap on the row
const handleClick = () => {
	if (props.action) emits('click');
};
</script>

<template>
	<li data-slot="list-row" :class="cn(props.class)">
		<!-- Row: the icon, the label, then the value, the badge, a control or a chevron -->
		<component :is="rowComponent"
			:to="props.to || undefined"
			:type="props.action ? 'button' : undefined"
			:class="cn(
				'flex min-h-13 w-full items-center px-4 py-2 text-left md:px-5',
				props.icon && !props.iconTile ? 'gap-2 md:gap-3' : 'gap-3', // A plain icon sits closer to its label on phones
				isInteractive && 'cursor-pointer transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none',
				props.danger ? 'text-destructive' : 'text-foreground'
			)"
			@click="handleClick">
			<!-- Icon -->
			<span v-if="props.icon && props.iconTile" class="flex size-8 shrink-0 items-center justify-center rounded border border-primary/30 bg-primary/10 text-primary">
				<HugeiconsIcon :icon="props.icon" class="size-4" />
			</span>
			<HugeiconsIcon v-else-if="props.icon" :icon="props.icon" :class="cn('size-4 shrink-0', !props.danger && 'text-muted-foreground')" />

			<!-- Label and description (a step smaller on phones, like the rows of the phone settings) -->
			<span class="flex min-w-0 flex-1 flex-col gap-0.5">
				<label v-if="props.labelFor" :for="props.labelFor" class="text-[0.8125rem] font-semibold md:text-sm">{{ props.label }}</label>
				<span v-else class="text-[0.8125rem] font-semibold md:text-sm">{{ props.label }}</span>
				<span v-if="props.description" :class="cn('text-[0.6875rem] md:text-xs', !props.danger && 'text-muted-foreground')">{{ props.description }}</span>
			</span>

			<!-- Value (cut off at 45% of the row, or wrapped when it must show whole) -->
			<span v-if="props.value" :class="cn('font-mono text-[0.6875rem] text-muted-foreground md:text-xs', props.wrapValue ? 'min-w-0 max-w-[60%] text-right wrap-anywhere' : 'max-w-[45%] truncate')">{{ props.value }}</span>

			<!-- Badge -->
			<span v-if="props.badge > 0" class="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 font-mono text-[0.625rem] font-bold text-primary-foreground">{{ props.badge }}</span>

			<!-- Control (a switch, a selector...) -->
			<slot name="trailing" />

			<!-- Chevron of the rows that open something -->
			<HugeiconsIcon v-if="isInteractive && !props.danger" :icon="ArrowRight01Icon" class="size-4 shrink-0 text-muted-foreground" />
		</component>

		<!-- Content under the label line, the full width of the row (a slider, a field, a meter), outside the link or button of the row -->
		<div v-if="$slots.default" class="-mt-1 px-4 pb-3 md:px-5">
			<slot />
		</div>
	</li>
</template>