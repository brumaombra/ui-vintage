<script setup lang="ts" generic="T extends { id: PropertyKey }">
import PackageIcon from '@hugeicons/core-free-icons/PackageIcon';
import { EmptyStateCard } from '../empty-state-card';
import { LoadMoreButton } from '../load-more-button';
import { LoadingStateCard } from '../loading-state-card';
import type { HugeiconsIconDefinition } from '../../lib/common-types';

// Space between the cards (on phones always less than the page padding)
export type CardGridGap = 'sm' | 'default' | 'lg';
const gapClasses: Record<CardGridGap, string> = {
	sm: 'gap-2 md:gap-3',
	default: 'gap-2 sm:gap-4 md:gap-6 xl:gap-4',
	lg: 'gap-2.5 sm:gap-5 md:gap-8 xl:gap-6'
};

// Props
const props = withDefaults(defineProps<{
	items?: T[];
	busy?: boolean;
	loadMoreBusy?: boolean;
	hasMore?: boolean;
	emptyMessage: string;
	emptyIcon?: HugeiconsIconDefinition;
	gap?: CardGridGap;
}>(), {
	items: () => [],
	busy: false,
	loadMoreBusy: false,
	hasMore: false,
	emptyIcon: () => PackageIcon,
	gap: 'default'
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
		<div v-else :class="['grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', gapClasses[props.gap]]">
			<slot name="card" v-for="item in props.items" :item="item" :key="item.id" />
		</div>

		<!-- Load more button (only under a grid, never under the loading or empty state) -->
		<LoadMoreButton v-if="!props.busy && props.items.length > 0 && (props.hasMore || props.loadMoreBusy)"
			:busy="props.loadMoreBusy"
			@load-more="handleLoadMore" />
	</div>
</template>