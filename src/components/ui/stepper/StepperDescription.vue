<script setup lang="ts">
import type { StepperDescriptionProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { StepperDescription } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props (rendered as inline text by default: the stepper trigger is a button, which can't hold headings or paragraphs)
const props = withDefaults(defineProps<StepperDescriptionProps & {
    class?: HTMLAttributes['class'];
}>(), {
    as: 'span'
});

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
    <StepperDescription data-slot="stepper-description" v-bind="delegatedProps" :class="cn('text-xs text-muted-foreground', props.class)">
        <slot />
    </StepperDescription>
</template>