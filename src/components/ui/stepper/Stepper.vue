<script setup lang="ts">
import type { StepperRootEmits, StepperRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { StepperRoot, useForwardPropsEmits } from 'reka-ui';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';

// Props
const props = withDefaults(defineProps<StepperRootProps & {
    class?: HTMLAttributes['class'];
}>(), {
    orientation: 'horizontal',
    linear: true,
});

// Emits
const emits = defineEmits<StepperRootEmits>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);

const { t } = useI18n();
</script>

<template>
    <StepperRoot v-slot="slotProps" data-slot="stepper" :aria-label="t('uiVintage.stepper.label')" v-bind="forwarded" :class="cn('flex gap-2 data-[orientation=vertical]:flex-col', props.class)">
        <slot v-bind="slotProps" />
    </StepperRoot>
</template>