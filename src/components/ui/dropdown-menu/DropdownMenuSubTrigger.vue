<script setup lang="ts">
import type { DropdownMenuSubTriggerProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { DropdownMenuSubTrigger, useForwardProps } from 'reka-ui';
import { cn } from '../../../lib/utils';
import { dropdownMenuItemClass } from './classes';

// Props
const props = defineProps<DropdownMenuSubTriggerProps & {
    class?: HTMLAttributes['class'];
    inset?: boolean;
}>();

const delegatedProps = reactiveOmit(props, 'class', 'inset');
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
    <DropdownMenuSubTrigger data-slot="dropdown-menu-sub-trigger" :data-inset="props.inset ? '' : undefined" v-bind="forwardedProps" :class="cn(
        'group/dropdown-sub-trigger',
        dropdownMenuItemClass,
        'data-[state=open]:bg-accent data-[state=open]:text-foreground data-[state=open]:before:scale-y-100',
        props.class
    )
        ">
        <slot />

        <!-- Chevron nudges right while the sub menu is open -->
        <span class="ml-auto flex items-center transition-transform duration-300 ease-spring group-data-[state=open]/dropdown-sub-trigger:translate-x-1">
            <HugeiconsIcon :icon="ArrowRight01Icon" class="size-4 opacity-60" />
        </span>
    </DropdownMenuSubTrigger>
</template>