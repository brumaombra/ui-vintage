<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" :class="cn('font-semibold text-primary/50 select-none [&>svg]:size-3.5', props.class)">
        <slot>/</slot>
    </li>
</template>