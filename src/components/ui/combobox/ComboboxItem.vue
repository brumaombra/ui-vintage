<script setup lang="ts">
import type { ComboboxItemEmits, ComboboxItemProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { ComboboxItem, ComboboxItemIndicator, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<ComboboxItemProps & { class?: HTMLAttributes['class'] }>();

// Emits
const emits = defineEmits<ComboboxItemEmits>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <ComboboxItem data-slot="combobox-item" v-bind="forwarded" :class="cn(
        'relative flex w-full cursor-pointer items-center gap-3 rounded py-2 pr-9 pl-3 text-left text-xs font-semibold text-muted-foreground outline-hidden select-none transition-colors duration-150 sm:text-sm',
        'data-highlighted:bg-accent data-highlighted:text-foreground data-[state=checked]:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        props.class
    )
        ">
        <slot />

        <!-- Trailing check indicator (pops in when selected) -->
        <span class="pointer-events-none absolute right-3 flex size-4 items-center justify-center text-primary">
            <ComboboxItemIndicator>
                <slot name="indicator-icon">
                    <HugeiconsIcon :icon="Tick02Icon" class="size-4 animate-uv-pop" :stroke-width="2.5" />
                </slot>
            </ComboboxItemIndicator>
        </span>
    </ComboboxItem>
</template>