<script setup lang="ts">
import type { ToggleEmits, ToggleProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ToggleVariants } from '.';
import { reactiveOmit } from '@vueuse/core';
import { Toggle, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';
import { toggleVariants } from '.';

// Props
const props = withDefaults(defineProps<ToggleProps & {
    variant?: ToggleVariants['variant'];
    size?: ToggleVariants['size'];
    class?: HTMLAttributes['class'];
}>(), {
    variant: 'default',
    size: 'default',
    disabled: false,
    modelValue: undefined,
});

// Emits
const emits = defineEmits<ToggleEmits>();

const delegatedProps = reactiveOmit(props, 'class', 'variant', 'size');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <Toggle v-slot="slotProps" data-slot="toggle" :data-variant="props.variant" :data-size="props.size" v-bind="forwarded" :class="cn(toggleVariants({ variant: props.variant, size: props.size }), props.class)">
        <slot v-bind="slotProps" />
    </Toggle>
</template>