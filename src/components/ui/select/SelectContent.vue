<script setup lang="ts">
import type { SelectContentEmits, SelectContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { SelectContent, SelectPortal, SelectViewport, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';
import { SelectScrollDownButton, SelectScrollUpButton } from '.';

defineOptions({
    inheritAttrs: false
});

// Props
const props = withDefaults(defineProps<SelectContentProps & { class?: HTMLAttributes['class'] }>(), {
    align: 'start',
    position: 'popper',
    sideOffset: 4,
    collisionPadding: 8
});

// Emits
const emits = defineEmits<SelectContentEmits>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <SelectPortal>
        <SelectContent data-slot="select-content" v-bind="{ ...$attrs, ...forwarded }" :class="cn(
            'uv-floating-motion bg-popover text-popover-foreground relative z-50 max-h-(--reka-select-content-available-height) min-w-32 overflow-x-hidden overflow-y-auto rounded border border-border shadow-elevated-lg max-sm:w-(--reka-select-trigger-width) max-sm:min-w-(--reka-select-trigger-width)',
            position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
            props.class
        )
            ">
            <SelectScrollUpButton />
            <SelectViewport :class="cn(
                'p-1',
                position === 'popper' &&
                'h-(--reka-select-trigger-height) w-full min-w-(--reka-select-trigger-width) scroll-my-1'
            )
                ">
                <slot />
            </SelectViewport>
            <SelectScrollDownButton />
        </SelectContent>
    </SelectPortal>
</template>