<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <ol data-slot="breadcrumb-list" :class="cn('flex w-fit max-w-full flex-wrap items-center gap-1.5 rounded border border-border bg-card px-3 py-1.5 text-xs wrap-break-word text-muted-foreground shadow-elevated-sm sm:gap-2 sm:text-sm', props.class)">
        <slot />
    </ol>
</template>