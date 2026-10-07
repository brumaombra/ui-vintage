<script setup lang="ts">
import type { SliderRootEmits, SliderRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { SliderRange, SliderRoot, SliderThumb, SliderTrack, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<SliderRootProps & {
    thumbLabel?: string;
    class?: HTMLAttributes['class'];
}>();

// Emits
const emits = defineEmits<SliderRootEmits>();

const delegatedProps = reactiveOmit(props, 'class', 'thumbLabel');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <SliderRoot v-slot="{ modelValue }" data-slot="slider" :class="cn(
        'group/slider relative flex w-full cursor-pointer touch-none items-center py-2 select-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:px-2 data-[orientation=vertical]:py-0',
        props.class
    )" v-bind="forwarded">
        <!-- Track -->
        <SliderTrack data-slot="slider-track" class="relative grow overflow-hidden rounded bg-muted data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2">
            <!-- Filled range -->
            <SliderRange data-slot="slider-range" class="absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
        </SliderTrack>

        <!-- Thumbs -->
        <SliderThumb v-for="(_, key) in modelValue" :key="key" data-slot="slider-thumb" :aria-label="props.thumbLabel" class="block size-5 shrink-0 cursor-grab rounded border-2 border-primary bg-card shadow-elevated-sm outline-none transition-[background-color,box-shadow] duration-150 hover:bg-[color-mix(in_oklab,var(--primary)_10%,var(--card))] focus-visible:ring-[3px] focus-visible:ring-ring/45 active:cursor-grabbing active:bg-[color-mix(in_oklab,var(--primary)_15%,var(--card))] disabled:pointer-events-none disabled:opacity-50" />
    </SliderRoot>
</template>