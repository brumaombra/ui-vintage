<script setup lang="ts">
import type { StepperTitleProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { StepperTitle } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<StepperTitleProps & {
    class?: HTMLAttributes['class'];
}>();

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
    <StepperTitle data-slot="stepper-title" v-bind="delegatedProps" :class="cn('text-xs font-semibold text-foreground transition-colors duration-150 group-data-[state=inactive]/stepper-item:text-muted-foreground sm:text-sm', props.class)">
        <slot />
    </StepperTitle>
</template>