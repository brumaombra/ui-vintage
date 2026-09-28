<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { DialogContent, DialogPortal, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';
import SheetOverlay from './SheetOverlay.vue';

interface SheetContentProps extends DialogContentProps {
    class?: HTMLAttributes['class'];
    side?: 'top' | 'right' | 'bottom' | 'left';
}

defineOptions({
    inheritAttrs: false
});

// Props
const props = withDefaults(defineProps<SheetContentProps>(), {
    side: 'right'
});
// Emits
const emits = defineEmits<DialogContentEmits>();

const delegatedProps = reactiveOmit(props, 'class', 'side');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <DialogPortal>
        <SheetOverlay />
        <DialogContent data-slot="sheet-content" :class="cn(
            'bg-background fixed z-50 flex flex-col gap-4 shadow-elevated-xl outline-none [animation-fill-mode:both] data-[state=open]:[animation-duration:480ms] data-[state=open]:[animation-timing-function:var(--ease-spring)] data-[state=closed]:[animation-duration:200ms] data-[state=closed]:[animation-timing-function:var(--ease-snappy)]',
            side === 'right' &&
            'data-[state=open]:[animation-name:uv-sheet-in-right] data-[state=closed]:[animation-name:uv-sheet-out-right] inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
            side === 'left' &&
            'data-[state=open]:[animation-name:uv-sheet-in-left] data-[state=closed]:[animation-name:uv-sheet-out-left] inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
            side === 'top' &&
            'data-[state=open]:[animation-name:uv-sheet-in-top] data-[state=closed]:[animation-name:uv-sheet-out-top] inset-x-0 top-0 h-auto border-b',
            side === 'bottom' &&
            'data-[state=open]:[animation-name:uv-sheet-in-bottom] data-[state=closed]:[animation-name:uv-sheet-out-bottom] inset-x-0 bottom-0 h-auto border-t',
            props.class
        )
            " v-bind="{ ...$attrs, ...forwarded }">
            <slot />
        </DialogContent>
    </DialogPortal>
</template>