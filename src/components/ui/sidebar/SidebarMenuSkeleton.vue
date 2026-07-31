<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';
import { Skeleton } from '../skeleton';

// Props
const props = defineProps<{
    showIcon?: boolean;
    class?: HTMLAttributes['class'];
}>();

const width = '72%';
</script>

<template>
    <div data-slot="sidebar-menu-skeleton" data-sidebar="menu-skeleton" :class="cn(
        'flex h-8 items-center gap-2 rounded-md px-2 group-data-[compact=true]/sidebar-wrapper:h-7 group-data-[compact=true]/sidebar-wrapper:gap-1.5 group-data-[compact=true]/sidebar-wrapper:px-1.5',
        props.class
    )
        ">
        <Skeleton v-if="showIcon" class="size-4 rounded-md group-data-[compact=true]/sidebar-wrapper:size-3.5" data-sidebar="menu-skeleton-icon" />

        <Skeleton class="h-4 max-w-(--skeleton-width) flex-1" data-sidebar="menu-skeleton-text" :style="{ '--skeleton-width': width }" />
    </div>
</template>