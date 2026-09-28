<script setup lang="ts">
import type { StepperDescriptionProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { StepperDescription } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<StepperDescriptionProps & {
    class?: HTMLAttributes['class'];
}>();

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
    <StepperDescription data-slot="stepper-description" v-bind="delegatedProps" :class="cn('text-xs text-muted-foreground', props.class)">
        <slot />
    </StepperDescription>
</template>