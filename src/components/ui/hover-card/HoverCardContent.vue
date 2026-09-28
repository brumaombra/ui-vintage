<script setup lang="ts">
import type { HoverCardContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { HoverCardContent, HoverCardPortal, useForwardProps } from 'reka-ui';
import { cn } from '../../../lib/utils';

defineOptions({
    inheritAttrs: false
});

// Props
const props = withDefaults(defineProps<HoverCardContentProps & { class?: HTMLAttributes['class'] }>(), {
    align: 'center',
    sideOffset: 8,
    collisionPadding: 8
});

const delegatedProps = reactiveOmit(props, 'class');
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
    <HoverCardPortal>
        <HoverCardContent data-slot="hover-card-content" v-bind="{ ...$attrs, ...forwardedProps }" :class="cn(
            'uv-floating-motion bg-popover text-popover-foreground z-50 w-72 rounded border border-border p-4 text-sm shadow-elevated-lg outline-hidden',
            props.class
        )
            ">
            <slot />
        </HoverCardContent>
    </HoverCardPortal>
</template>