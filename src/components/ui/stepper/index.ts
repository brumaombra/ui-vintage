import type { HugeiconsIconDefinition } from '../../../lib/common-types';

export { default as SimpleStepper } from './SimpleStepper.vue';
export { default as Stepper } from './Stepper.vue';
export { default as StepperDescription } from './StepperDescription.vue';
export { default as StepperIndicator } from './StepperIndicator.vue';
export { default as StepperItem } from './StepperItem.vue';
export { default as StepperSeparator } from './StepperSeparator.vue';
export { default as StepperTitle } from './StepperTitle.vue';
export { default as StepperTrigger } from './StepperTrigger.vue';

// Step definition used by SimpleStepper
export type StepperStep = {
    title: string;
    description?: string;
    icon?: HugeiconsIconDefinition;
};