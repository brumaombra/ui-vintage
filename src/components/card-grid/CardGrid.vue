<script setup lang="ts" generic="T extends { id: PropertyKey }">
import { PackageIcon } from '@hugeicons/core-free-icons';
import { EmptyStateCard } from '../empty-state-card';
import { LoadMoreButton } from '../load-more-button';
import { LoadingStateCard } from '../loading-state-card';

type HugeiconsIconDefinition = readonly (readonly [string, { readonly [key: string]: string | number }])[];

// Props
const props = withDefaults(defineProps<{
    items?: T[];
    busy?: boolean;
    loadMoreBusy?: boolean;
    hasMore?: boolean;
    emptyMessage: string;
    emptyIcon?: HugeiconsIconDefinition;
}>(), {
    items: () => [],
    busy: false,
    loadMoreBusy: false,
    hasMore: false,
    emptyIcon: () => PackageIcon
});

// Emits
const emits = defineEmits<{
    'load-more': [];
}>();

// Slots
defineSlots<{
    card(props: { item: T; key?: PropertyKey }): unknown;
}>();

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
        <EmptyStateCard v-else-if="props.items.length === 0"
            :description="props.emptyMessage"
            :icon="props.emptyIcon" />

        <!-- Cards grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-4">
            <slot name="card" v-for="item in props.items" :item="item" :key="item.id" />
        </div>

        <!-- Load more button -->
        <div v-if="props.hasMore || (props.loadMoreBusy && props.items.length > 0)" class="flex justify-center mt-6">
            <LoadMoreButton :busy="props.loadMoreBusy"
                @load-more="handleLoadMore" />
        </div>
    </div>
</template>