<script setup lang="ts">
import type { ComboboxAnchorProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ComboboxAnchor, injectComboboxRootContext, useForwardProps } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = withDefaults(defineProps<ComboboxAnchorProps & {
    class?: HTMLAttributes['class'];
    size?: 'sm' | 'default';
}>(), { size: 'default' });

const delegatedProps = reactiveOmit(props, 'class', 'size');
const forwardedProps = useForwardProps(delegatedProps);

const rootContext = injectComboboxRootContext();

// Clicking the empty area of the field focuses the search input and opens the list
const handleClick = (event: MouseEvent) => {
    if (rootContext.disabled.value) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, input, a')) return;
    rootContext.inputElement.value?.focus();
    if (!rootContext.open.value) rootContext.onOpenChange(true);
};
</script>

<template>
    <ComboboxAnchor data-slot="combobox-anchor" :data-size="props.size" :data-state="rootContext.open.value ? 'open' : 'closed'" :data-disabled="rootContext.disabled.value ? '' : undefined" v-bind="forwardedProps" :class="cn(
        'group/combobox-anchor uv-field flex w-full cursor-text items-center gap-2 rounded border border-input bg-secondary px-4 py-1.5 text-xs font-semibold text-foreground shadow-elevated-sm sm:text-sm',
        'data-[size=default]:min-h-13 data-[size=sm]:min-h-10 data-disabled:cursor-not-allowed data-disabled:opacity-60',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 [&_svg:not([class*=\'text-\'])]:text-muted-foreground',
        props.class
    )
        " @click="handleClick">
        <slot />
    </ComboboxAnchor>
</template>