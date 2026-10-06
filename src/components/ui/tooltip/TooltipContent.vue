<script setup lang="ts">
import type { TooltipContentEmits, TooltipContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { TooltipArrow, TooltipContent, TooltipPortal, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';

defineOptions({
    inheritAttrs: false
});

// Props
const props = withDefaults(defineProps<TooltipContentProps & {
    class?: HTMLAttributes['class'];
}>(), {
    sideOffset: 4
});

// Emits
const emits = defineEmits<TooltipContentEmits>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <TooltipPortal>
        <TooltipContent data-slot="tooltip-content" v-bind="{ ...forwarded, ...$attrs }" :class="cn(
            'uv-floating-motion bg-foreground text-background z-50 w-fit max-w-72 rounded px-3 py-1.5 text-xs font-semibold text-balance shadow-elevated-lg',
            props.class
        )
            ">
            <slot />

            <TooltipArrow class="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-xs" />
        </TooltipContent>
    </TooltipPortal>
</template>