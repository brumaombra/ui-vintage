<script setup lang="ts">
import type { SliderRootEmits, SliderRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { SliderRange, SliderRoot, SliderThumb, SliderTrack, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<SliderRootProps & {
    class?: HTMLAttributes['class'];
}>();

// Emits
const emits = defineEmits<SliderRootEmits>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <SliderRoot v-slot="{ modelValue }" data-slot="slider" :class="cn(
        'group/slider relative flex w-full cursor-pointer touch-none items-center py-2 select-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:px-2 data-[orientation=vertical]:py-0',
        props.class
    )" v-bind="forwarded">
        <!-- Track -->
        <SliderTrack data-slot="slider-track" class="relative grow overflow-hidden rounded bg-muted transition-[height,width] duration-200 ease-spring data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2 group-hover/slider:data-[orientation=horizontal]:h-2.5 group-hover/slider:data-[orientation=vertical]:w-2.5">
            <!-- Filled range -->
            <SliderRange data-slot="slider-range" class="absolute bg-primary bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.22))] data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
        </SliderTrack>

        <!-- Thumbs -->
        <SliderThumb v-for="(_, key) in modelValue" :key="key" data-slot="slider-thumb" class="block size-5 shrink-0 cursor-grab rounded border-2 border-primary bg-white shadow-elevated-md outline-none [transition:scale_300ms_var(--ease-spring),box-shadow_200ms] hover:scale-110 hover:shadow-[0_0_0_6px_color-mix(in_oklab,var(--primary)_16%,transparent)] focus-visible:shadow-[0_0_0_6px_color-mix(in_oklab,var(--primary)_24%,transparent)] active:scale-125 active:cursor-grabbing disabled:pointer-events-none disabled:opacity-50" />
    </SliderRoot>
</template>