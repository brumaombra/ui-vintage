<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <tfoot data-slot="table-footer" :class="cn(
        'bg-muted/50 border-t border-border font-semibold [&>tr]:last:border-b-0',
        props.class
    )
        ">
        <slot />
    </tfoot>
</template>