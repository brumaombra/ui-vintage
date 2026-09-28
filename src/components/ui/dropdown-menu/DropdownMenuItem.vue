<script setup lang="ts">
import type { DropdownMenuItemEmits, DropdownMenuItemProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { DropdownMenuItem, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';
import { dropdownMenuItemClass } from './classes';

// Props
const props = withDefaults(defineProps<DropdownMenuItemProps & {
    class?: HTMLAttributes['class'];
    inset?: boolean;
    variant?: 'default' | 'destructive';
}>(), {
    variant: 'default'
});

// Emits
const emits = defineEmits<DropdownMenuItemEmits>();

const delegatedProps = reactiveOmit(props, 'class', 'inset', 'variant');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <DropdownMenuItem data-slot="dropdown-menu-item" :data-inset="props.inset ? '' : undefined" :data-variant="props.variant" v-bind="forwarded" :class="cn(
        dropdownMenuItemClass,
        props.variant === 'destructive' && 'text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive',
        props.class
    )
        ">
        <slot />
    </DropdownMenuItem>
</template>