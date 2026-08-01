<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <td data-slot="table-cell" :class="cn(
        'px-2 py-3 max-w-75 text-xs md:text-sm align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5',
        props.class
    )
        ">
        <slot />
    </td>
</template>