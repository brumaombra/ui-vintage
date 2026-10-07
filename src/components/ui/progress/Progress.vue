<script setup lang="ts">
import type { ProgressRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ProgressIndicator, ProgressRoot } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = withDefaults(defineProps<ProgressRootProps & {
    indeterminate?: boolean;
    class?: HTMLAttributes['class'];
}>(), {
    modelValue: 0,
    indeterminate: false
});

const delegatedProps = reactiveOmit(props, 'class', 'indeterminate');

// Resolve the fill percentage against the configured max
const percentage = computed(() => {
    const max = props.max ?? 100;
    if (!max) return 0;
    return Math.min(100, Math.max(0, ((props.modelValue ?? 0) / max) * 100));
});
</script>

<template>
    <ProgressRoot data-slot="progress" v-bind="delegatedProps" :model-value="props.indeterminate ? null : props.modelValue" :class="cn(
        'relative h-2 w-full overflow-hidden rounded-sm bg-muted',
        props.class
    )">
        <!-- Indeterminate bar -->
        <div v-if="props.indeterminate" data-slot="progress-indicator" class="absolute inset-y-0 left-0 w-full origin-left animate-uv-indeterminate rounded-sm bg-primary" />

        <!-- Determinate bar -->
        <ProgressIndicator v-else data-slot="progress-indicator" class="relative h-full w-full flex-1 overflow-hidden rounded-sm bg-primary transition-transform duration-700 ease-out-expo" :style="`transform: translateX(-${100 - percentage}%);`" />
    </ProgressRoot>
</template>