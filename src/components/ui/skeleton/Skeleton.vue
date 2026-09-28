<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <div data-slot="skeleton" :class="cn(
        'relative overflow-hidden rounded border border-border bg-surface',
        'after:absolute after:inset-0 after:animate-uv-shimmer after:bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--foreground)_6%,transparent),transparent)]',
        props.class
    )" />
</template>