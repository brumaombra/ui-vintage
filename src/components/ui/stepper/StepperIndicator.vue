<script setup lang="ts">
import type { StepperIndicatorProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { reactiveOmit } from '@vueuse/core';
import { injectStepperItemContext, StepperIndicator } from 'reka-ui';
import { computed } from 'vue';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<StepperIndicatorProps & {
    class?: HTMLAttributes['class'];
}>();

const delegatedProps = reactiveOmit(props, 'class');

// State of the parent step
const itemContext = injectStepperItemContext();
const state = computed(() => itemContext.state.value);
</script>

<template>
    <StepperIndicator v-slot="{ step }" data-slot="stepper-indicator" :data-state="state" v-bind="delegatedProps" :class="cn(
        'relative inline-flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card text-sm font-bold text-muted-foreground ring-0 ring-primary/15 tabular-nums',
        '[transition:color_150ms,background-color_220ms,border-color_220ms,box-shadow_380ms_var(--ease-spring),transform_380ms_var(--ease-spring)]',
        'group-hover/stepper-trigger:border-border-strong group-active/stepper-trigger:scale-95 group-active/stepper-trigger:duration-75',
        'data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:ring-4 data-[state=active]:group-hover/stepper-trigger:border-primary',
        'data-[state=completed]:border-primary data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground data-[state=completed]:group-hover/stepper-trigger:border-primary',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        props.class
    )">
        <slot :step="step" :state="state">
            <!-- Completed check -->
            <HugeiconsIcon v-if="state === 'completed'" :icon="Tick02Icon" class="size-4 animate-uv-pop" :stroke-width="2.5" />

            <!-- Step number -->
            <span v-else>{{ step }}</span>
        </slot>
    </StepperIndicator>
</template>