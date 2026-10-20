<script setup lang="ts">
import type { ProgressRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ProgressIndicator, ProgressRoot } from 'reka-ui';
import { cn } from '../../../lib/utils';

type ProgressColor = 'primary' | 'green' | 'red' | 'yellow';

// Props
const props = withDefaults(defineProps<ProgressRootProps & {
	indeterminate?: boolean;
	color?: ProgressColor;
	class?: HTMLAttributes['class'];
}>(), {
	modelValue: 0,
	indeterminate: false,
	color: 'primary'
});

const delegatedProps = reactiveOmit(props, 'class', 'indeterminate', 'color');

// Fill color of the bar
const colorClasses: Record<ProgressColor, string> = {
	primary: 'bg-primary',
	green: 'bg-success',
	red: 'bg-destructive',
	yellow: 'bg-warning'
};

// Resolve the fill percentage against the configured max
const percentage = computed(() => {
	const max = props.max ?? 100;
	if (!max) return 0;
	return Math.min(100, Math.max(0, ((props.modelValue ?? 0) / max) * 100));
});
</script>

<template>
	<ProgressRoot data-slot="progress" v-bind="delegatedProps" :model-value="props.indeterminate ? null : props.modelValue" :class="cn(
		'relative h-2 w-full overflow-hidden rounded bg-muted',
		props.class
	)">
		<!-- Indeterminate bar -->
		<div v-if="props.indeterminate" data-slot="progress-indicator" :class="cn('absolute inset-y-0 left-0 w-full origin-left animate-uv-indeterminate rounded', colorClasses[props.color])" />

		<!-- Determinate bar -->
		<ProgressIndicator v-else data-slot="progress-indicator" :class="cn('relative h-full w-full flex-1 overflow-hidden rounded transition-transform duration-700 ease-out-expo', colorClasses[props.color])" :style="`transform: translateX(-${100 - percentage}%);`" />
	</ProgressRoot>
</template>