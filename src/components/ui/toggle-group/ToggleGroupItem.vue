<script setup lang="ts">
import type { ToggleGroupItemProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ToggleGroupSize } from '.';
import { reactiveOmit } from '@vueuse/core';
import { ToggleGroupItem, useForwardProps } from 'reka-ui';
import { computed, inject } from 'vue';
import { cn } from '../../../lib/utils';
import { toggleGroupContextKey, toggleGroupItemVariants } from '.';

// Props
const props = defineProps<ToggleGroupItemProps & {
	size?: ToggleGroupSize;
	class?: HTMLAttributes['class'];
}>();

const delegatedProps = reactiveOmit(props, 'class', 'size');
const forwardedProps = useForwardProps(delegatedProps);

// Size, indicator mode and highlight come from the group
const context = inject(toggleGroupContextKey, null);
const size = computed(() => props.size ?? context?.size.value ?? 'default');
const hasIndicator = computed(() => context?.indicator.value ?? false);
const isHighlighted = computed(() => context?.highlight.value ?? false);
</script>

<template>
	<ToggleGroupItem v-slot="slotProps" data-slot="toggle-group-item" :data-size="size" v-bind="forwardedProps" :class="cn(
		toggleGroupItemVariants({ size }),
		!hasIndicator && 'hover:bg-accent data-[state=on]:bg-accent',
		isHighlighted && 'data-[state=on]:text-primary-foreground', // Dark text on the solid orange indicator, like the active tab
		props.class
	)">
		<slot v-bind="slotProps" />
	</ToggleGroupItem>
</template>