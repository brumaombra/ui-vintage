<script setup lang="ts">
import type { ComboboxContentEmits, ComboboxContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ComboboxContent, ComboboxPortal, ComboboxViewport, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';

defineOptions({
    inheritAttrs: false
});

// Props
const props = withDefaults(defineProps<ComboboxContentProps & {
    class?: HTMLAttributes['class'];
    viewportClass?: HTMLAttributes['class'];
}>(), {
    position: 'popper',
    align: 'start',
    sideOffset: 6,
    collisionPadding: 8
});

// Emits
const emits = defineEmits<ComboboxContentEmits>();

const delegatedProps = reactiveOmit(props, 'class', 'viewportClass');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <ComboboxPortal>
        <ComboboxContent data-slot="combobox-list" v-bind="{ ...$attrs, ...forwarded }" :class="cn(
            'uv-floating-motion bg-popover text-popover-foreground z-50 flex w-(--reka-combobox-trigger-width) max-h-[min(var(--reka-combobox-content-available-height),20rem)] flex-col overflow-hidden rounded border border-border shadow-elevated-lg outline-hidden',
            props.class
        )
            ">
            <!-- Scrollable viewport -->
            <ComboboxViewport data-slot="combobox-viewport" :class="cn('min-h-0 scroll-py-1 p-1', props.viewportClass)">
                <slot />
            </ComboboxViewport>
        </ComboboxContent>
    </ComboboxPortal>
</template>