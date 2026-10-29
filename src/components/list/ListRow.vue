<script setup lang="ts">
import { NuxtLinkLocale } from '#components';
import { computed } from 'vue';
import type { HTMLAttributes } from 'vue';
import ArrowRight01Icon from '@hugeicons/core-free-icons/ArrowRight01Icon';
import { HugeiconsIcon } from '@hugeicons/vue';
import { cn } from '../../lib/utils';
import type { HugeiconsIconDefinition } from '../../lib/common-types';

// Props (a row is a link with `to`, a button with `action`, or a plain row holding its own control in the trailing slot)
const props = withDefaults(defineProps<{
	label: string;
	icon?: HugeiconsIconDefinition | null;
	iconTile?: boolean; // The icon in a tinted tile (pages), or plain (settings)
	value?: string; // Current value, on the right
	badge?: number; // Count on the right (e.g. unread items)
	to?: string; // Localized path of the page it opens
	action?: boolean; // A button: it emits click
	danger?: boolean;
	labelFor?: string; // Id of the control in the trailing slot, so a tap on the label reaches it
	class?: HTMLAttributes['class'];
}>(), {
	icon: null,
	iconTile: false,
	value: '',
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

			<!-- Label (a step smaller on phones, like the rows of the phone settings) -->
			<label v-if="props.labelFor" :for="props.labelFor" class="min-w-0 flex-1 text-[0.8125rem] font-semibold md:text-sm">{{ props.label }}</label>
			<span v-else class="min-w-0 flex-1 text-[0.8125rem] font-semibold md:text-sm">{{ props.label }}</span>

			<!-- Value -->
			<span v-if="props.value" class="max-w-[45%] truncate font-mono text-[0.6875rem] text-muted-foreground md:text-xs">{{ props.value }}</span>

			<!-- Badge -->
			<span v-if="props.badge > 0" class="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 font-mono text-[0.625rem] font-bold text-primary-foreground">{{ props.badge }}</span>

			<!-- Control (a switch, a selector...) -->
			<slot name="trailing" />

			<!-- Chevron of the rows that open something -->
			<HugeiconsIcon v-if="isInteractive && !props.danger" :icon="ArrowRight01Icon" class="size-4 shrink-0 text-muted-foreground" />
		</component>
	</li>
</template>