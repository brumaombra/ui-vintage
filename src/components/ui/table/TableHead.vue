<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <th data-slot="table-head" :class="cn(
        'text-foreground h-10 px-2 max-w-75 text-left align-middle font-semibold whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5',
        props.class
    )
        ">
        <slot />
    </th>
</template>