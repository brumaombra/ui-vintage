<script setup lang="ts">
import type { PopoverContentEmits, PopoverContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { PopoverContent, PopoverPortal, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';

defineOptions({
    inheritAttrs: false
});

// Props
const props = withDefaults(defineProps<PopoverContentProps & { class?: HTMLAttributes['class'] }>(), {
    align: 'center',
    sideOffset: 4
});

// Emits
const emits = defineEmits<PopoverContentEmits>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <PopoverPortal>
        <PopoverContent data-slot="popover-content" v-bind="{ ...$attrs, ...forwarded }" :class="cn(
            'uv-floating-motion bg-popover text-popover-foreground z-50 w-72 rounded border border-border p-4 shadow-elevated-lg outline-hidden',
            props.class
        )
            ">
            <slot />
        </PopoverContent>
    </PopoverPortal>
</template>