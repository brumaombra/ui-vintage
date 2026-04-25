<script setup lang="ts">
import { PackageIcon } from '@hugeicons/core-free-icons';
import { EmptyStateCard } from '@/components/empty-state-card';
import { LoadMoreButton } from '@/components/load-more-button';
import { LoadingStateCard } from '@/components/loading-state-card';

// Props
const props = defineProps({
    items: { type: Array, default: () => [] },
    busy: { type: Boolean, default: false },
    loadMoreBusy: { type: Boolean, default: false },
    hasMore: { type: Boolean, default: false },
    emptyMessage: { type: String, required: true },
    emptyIcon: { type: Object, default: () => PackageIcon }
});

// Emits
const emits = defineEmits(['load-more']);

// Handle load more
const handleLoadMore = () => {
    emits('load-more');
};
</script>

<template>
    <div>
        <!-- Busy state for initial loading -->
        <LoadingStateCard v-if="props.busy" />

        <!-- Empty state -->
        <EmptyStateCard v-else-if="!props.items || props.items.length === 0"
            :description="props.emptyMessage"
            :icon="props.emptyIcon" />

        <!-- Cards grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-4">
            <slot name="card" v-for="item in props.items" :item="item" :key="(item as any).id" />
        </div>

        <!-- Load more button -->
        <div v-if="props.hasMore || (props.loadMoreBusy && props.items.length > 0)" class="flex justify-center mt-6">
            <LoadMoreButton :busy="props.loadMoreBusy"
                @load-more="handleLoadMore" />
        </div>
    </div>
</template>