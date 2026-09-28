<script setup lang="ts">
import type { DropdownMenuLabelProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { DropdownMenuLabel, useForwardProps } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<DropdownMenuLabelProps & {
    class?: HTMLAttributes['class'];
    inset?: boolean;
}>();

const delegatedProps = reactiveOmit(props, 'class', 'inset');
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
    <DropdownMenuLabel data-slot="dropdown-menu-label" :data-inset="props.inset ? '' : undefined" v-bind="forwardedProps" :class="cn(
        'px-3 pt-2 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground select-none data-inset:pl-9',
        props.class
    )
        ">
        <slot />
    </DropdownMenuLabel>
</template>