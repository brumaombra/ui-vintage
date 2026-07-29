<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <p data-slot="card-text" :class="cn(
        'text-xs sm:text-sm text-(--text-secondary-light) dark:text-(--text-secondary-dark)',
        props.class,
    )
        ">
        <slot />
    </p>
</template>