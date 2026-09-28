<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <span data-slot="dropdown-menu-shortcut" :class="cn('ml-auto pl-4 text-[11px] font-semibold tracking-widest text-muted-foreground', props.class)">
        <slot />
    </span>
</template>