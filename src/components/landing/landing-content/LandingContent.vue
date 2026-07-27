<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <div :class="cn('mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 lg:px-8 lg:py-14', props.class)">
        <slot />
    </div>
</template>