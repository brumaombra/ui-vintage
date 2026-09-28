<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { StepperStep } from '.';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { computed } from 'vue';
import { cn } from '../../../lib/utils';
import Stepper from './Stepper.vue';
import StepperDescription from './StepperDescription.vue';
import StepperIndicator from './StepperIndicator.vue';
import StepperItem from './StepperItem.vue';
import StepperSeparator from './StepperSeparator.vue';
import StepperTitle from './StepperTitle.vue';
import StepperTrigger from './StepperTrigger.vue';

// Props
const props = withDefaults(defineProps<{
    steps: StepperStep[];
    orientation?: 'horizontal' | 'vertical';
    linear?: boolean;
    class?: HTMLAttributes['class'];
}>(), {
    orientation: 'horizontal',
    linear: true,
});

// Active step (1-based, v-model)
const modelValue = defineModel<number>({ default: 1 });

const isVertical = computed(() => props.orientation === 'vertical');
</script>

<template>
    <Stepper v-model="modelValue" :orientation="props.orientation" :linear="props.linear" :class="cn('w-full', isVertical ? 'gap-0' : 'items-start gap-2', props.class)">
        <StepperItem v-for="(step, index) in props.steps" :key="index" :step="index + 1" :class="isVertical ? 'items-start gap-0 pb-8 last:pb-0' : 'flex-1 flex-col items-center gap-0'">
            <!-- Step trigger -->
            <StepperTrigger :class="isVertical ? 'items-start gap-4' : 'flex-col gap-2 text-center'">
                <StepperIndicator v-slot="{ step: stepNumber, state }">
                    <!-- Custom icon until the step is completed -->
                    <HugeiconsIcon v-if="state !== 'completed' && step.icon" :icon="step.icon" class="size-4" />
                    <span v-else-if="state !== 'completed'">{{ stepNumber }}</span>
                    <HugeiconsIcon v-else :icon="Tick02Icon" class="size-4 animate-uv-pop" :stroke-width="2.5" />
                </StepperIndicator>

                <!-- Step text -->
                <div :class="cn('flex flex-col gap-0.5', isVertical ? 'pt-2' : 'items-center px-1')">
                    <StepperTitle>{{ step.title }}</StepperTitle>
                    <StepperDescription v-if="step.description">{{ step.description }}</StepperDescription>
                </div>
            </StepperTrigger>

            <!-- Connector to the next step -->
            <StepperSeparator v-if="index < props.steps.length - 1" :class="isVertical ? 'absolute top-12 bottom-1 left-[21px]' : 'absolute top-[21px] right-[calc(-50%+18px)] left-[calc(50%+26px)]'" />
        </StepperItem>
    </Stepper>
</template>