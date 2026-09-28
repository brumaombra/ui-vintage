<script setup lang="ts">
import type { DialogOverlayProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { DialogOverlay } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<DialogOverlayProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
    <DialogOverlay data-slot="sheet-overlay" :class="cn(
        'uv-overlay-motion fixed inset-0 z-50 bg-black/40 backdrop-blur-[3px] dark:bg-black/60',
        props.class
    )
        " v-bind="delegatedProps">
        <slot />
    </DialogOverlay>
</template>