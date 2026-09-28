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
        'text-xs sm:text-sm text-muted-foreground',
        props.class,
    )
        ">
        <slot />
    </p>
</template>