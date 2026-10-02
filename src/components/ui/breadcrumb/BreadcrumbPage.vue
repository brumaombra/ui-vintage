<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <span data-slot="breadcrumb-page" role="link" aria-disabled="true" aria-current="page" :class="cn('min-w-0 font-semibold text-foreground', props.class)">
        <slot />
    </span>
</template>