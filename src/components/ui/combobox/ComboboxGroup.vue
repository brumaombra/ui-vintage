<script setup lang="ts">
import type { ComboboxGroupProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ComboboxGroup, ComboboxLabel } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<ComboboxGroupProps & {
    class?: HTMLAttributes['class'];
    heading?: string;
}>();

const delegatedProps = reactiveOmit(props, 'class', 'heading');
</script>

<template>
    <ComboboxGroup data-slot="combobox-group" v-bind="delegatedProps" :class="cn('overflow-hidden', props.class)">
        <!-- Heading -->
        <ComboboxLabel v-if="props.heading || $slots.heading" data-slot="combobox-group-heading" class="px-3 pt-2 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground select-none">
            <slot name="heading">{{ props.heading }}</slot>
        </ComboboxLabel>

        <slot />
    </ComboboxGroup>
</template>