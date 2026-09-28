<script setup lang="ts">
import type { SelectTriggerProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { SelectIcon, SelectTrigger, useForwardProps } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = withDefaults(defineProps<SelectTriggerProps & {
    class?: HTMLAttributes['class'];
    size?: 'sm' | 'default';
}>(), { size: 'default' });

const delegatedProps = reactiveOmit(props, 'class', 'size');
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
    <SelectTrigger data-slot="select-trigger" :data-size="size" v-bind="forwardedProps" :class="cn(
        'group/select-trigger uv-field flex w-fit cursor-pointer items-center justify-between gap-2 rounded border border-input bg-secondary px-4 py-3 text-xs font-semibold whitespace-nowrap text-foreground shadow-elevated-sm outline-none data-placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60 data-[size=default]:h-13 data-[size=sm]:h-10 sm:text-sm',
        '*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 [&_svg:not([class*=\'text-\'])]:text-muted-foreground',
        'aria-invalid:animate-uv-shake',
        props.class
    )">
        <slot />
        <SelectIcon as-child>
            <HugeiconsIcon :icon="ArrowDown01Icon" class="size-4 opacity-60 transition-transform duration-300 ease-spring group-data-[state=open]/select-trigger:rotate-180" />
        </SelectIcon>
    </SelectTrigger>
</template>