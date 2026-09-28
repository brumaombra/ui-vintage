<script setup lang="ts">
import type { StepperSeparatorProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { injectStepperItemContext, injectStepperRootContext, StepperSeparator } from 'reka-ui';
import { computed } from 'vue';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<StepperSeparatorProps & {
    class?: HTMLAttributes['class'];
}>();

const delegatedProps = reactiveOmit(props, 'class');

// Orientation and completion come from the stepper
const rootContext = injectStepperRootContext();
const itemContext = injectStepperItemContext();
const isVertical = computed(() => rootContext.orientation.value === 'vertical');
const isCompleted = computed(() => itemContext.state.value === 'completed');

// Fill grows along the track from its start
const fillClass = computed(() => {
    if (isVertical.value) return cn('origin-top', isCompleted.value ? 'scale-y-100' : 'scale-y-0');
    return cn('origin-left rtl:origin-right', isCompleted.value ? 'scale-x-100' : 'scale-x-0');
});
</script>

<template>
    <StepperSeparator data-slot="stepper-separator" v-bind="delegatedProps" :class="cn('relative shrink-0 overflow-hidden rounded-full bg-border', isVertical ? 'w-0.5' : 'h-0.5', props.class)">
        <!-- Progress fill -->
        <span aria-hidden="true" :class="cn('absolute inset-0 rounded-full bg-primary transition-transform duration-500 ease-out-expo', fillClass)" />
    </StepperSeparator>
</template>