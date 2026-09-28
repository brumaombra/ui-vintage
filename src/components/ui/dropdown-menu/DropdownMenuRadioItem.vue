<script setup lang="ts">
import type { DropdownMenuRadioItemEmits, DropdownMenuRadioItemProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { DropdownMenuItemIndicator, DropdownMenuRadioItem, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';
import { dropdownMenuItemClass } from './classes';

// Props
const props = defineProps<DropdownMenuRadioItemProps & { class?: HTMLAttributes['class'] }>();

// Emits
const emits = defineEmits<DropdownMenuRadioItemEmits>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <DropdownMenuRadioItem data-slot="dropdown-menu-radio-item" v-bind="forwarded" :class="cn(dropdownMenuItemClass, 'group/dropdown-radio-item pl-9 data-[state=checked]:text-foreground', props.class)">
        <!-- Radio ring with a dot that pops in when checked -->
        <span class="pointer-events-none absolute left-3 flex size-4 items-center justify-center rounded-full border border-border-strong transition-colors duration-150 group-data-[state=checked]/dropdown-radio-item:border-primary">
            <DropdownMenuItemIndicator>
                <slot name="indicator-icon">
                    <span class="block size-2 animate-uv-pop rounded-full bg-primary" />
                </slot>
            </DropdownMenuItemIndicator>
        </span>

        <slot />
    </DropdownMenuRadioItem>
</template>