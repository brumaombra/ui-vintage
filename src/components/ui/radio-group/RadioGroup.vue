<script setup lang="ts">
import type { RadioGroupRootEmits, RadioGroupRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { RadioGroupRoot, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<RadioGroupRootProps & {
    class?: HTMLAttributes['class'];
}>();

// Emits
const emits = defineEmits<RadioGroupRootEmits>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <RadioGroupRoot v-slot="slotProps" data-slot="radio-group" v-bind="forwarded" :class="cn(
        'grid gap-3 aria-[orientation=horizontal]:flex aria-[orientation=horizontal]:flex-wrap aria-[orientation=horizontal]:items-center aria-[orientation=horizontal]:gap-x-5',
        props.class
    )">
        <slot v-bind="slotProps" />
    </RadioGroupRoot>
</template>