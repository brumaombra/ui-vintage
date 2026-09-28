<script setup lang="ts">
import type { DropdownMenuCheckboxItemEmits, DropdownMenuCheckboxItemProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { DropdownMenuCheckboxItem, DropdownMenuItemIndicator, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';
import { dropdownMenuItemClass } from './classes';

// Props
const props = defineProps<DropdownMenuCheckboxItemProps & { class?: HTMLAttributes['class'] }>();

// Emits
const emits = defineEmits<DropdownMenuCheckboxItemEmits>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <DropdownMenuCheckboxItem data-slot="dropdown-menu-checkbox-item" v-bind="forwarded" :class="cn(dropdownMenuItemClass, 'pl-9 data-[state=checked]:text-foreground', props.class)">
        <!-- Check indicator (pops in when checked) -->
        <span class="pointer-events-none absolute left-3 flex size-4 items-center justify-center text-primary">
            <DropdownMenuItemIndicator>
                <slot name="indicator-icon">
                    <HugeiconsIcon :icon="Tick02Icon" class="size-4 animate-uv-pop" :stroke-width="2.5" />
                </slot>
            </DropdownMenuItemIndicator>
        </span>

        <slot />
    </DropdownMenuCheckboxItem>
</template>