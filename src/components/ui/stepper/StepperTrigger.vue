<script setup lang="ts">
import type { StepperTriggerProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { StepperTrigger } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<StepperTriggerProps & {
    class?: HTMLAttributes['class'];
}>();

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
    <StepperTrigger data-slot="stepper-trigger" v-bind="delegatedProps" :class="cn('group/stepper-trigger flex cursor-pointer items-center gap-3 rounded p-1 text-left outline-none transition-colors duration-150 focus-visible:ring-[3px] focus-visible:ring-ring/45 data-disabled:cursor-not-allowed', props.class)">
        <slot />
    </StepperTrigger>
</template>