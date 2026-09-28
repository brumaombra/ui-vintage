<script setup lang="ts">
import type { AlertDialogContentEmits, AlertDialogContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { AlertDialogContent, AlertDialogOverlay, AlertDialogPortal, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Keep attrs on the dialog content element
defineOptions({
    inheritAttrs: false
});

// Props
const props = defineProps<AlertDialogContentProps & { class?: HTMLAttributes['class'] }>();

// Emits
const emits = defineEmits<AlertDialogContentEmits>();

// Omit local class from delegated props
const delegatedProps = reactiveOmit(props, 'class');

// Forward props and emits
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <AlertDialogPortal>
        <AlertDialogOverlay data-slot="alert-dialog-overlay" class="uv-overlay-motion fixed inset-0 z-50 bg-black/40 backdrop-blur-[3px] dark:bg-black/60" />
        <AlertDialogContent data-slot="alert-dialog-content" v-bind="{ ...$attrs, ...forwarded }" :class="cn('uv-modal-motion bg-card text-card-foreground fixed top-[50%] left-[50%] z-50 grid w-[95%] max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-0 overflow-hidden rounded border border-border shadow-elevated-xl sm:max-w-lg', props.class)">
            <slot />
        </AlertDialogContent>
    </AlertDialogPortal>
</template>