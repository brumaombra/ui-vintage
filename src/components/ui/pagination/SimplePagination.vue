<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import Pagination from './Pagination.vue';
import PaginationContent from './PaginationContent.vue';
import PaginationEllipsis from './PaginationEllipsis.vue';
import PaginationFirst from './PaginationFirst.vue';
import PaginationItem from './PaginationItem.vue';
import PaginationLast from './PaginationLast.vue';
import PaginationNext from './PaginationNext.vue';
import PaginationPrevious from './PaginationPrevious.vue';

// Props
const props = withDefaults(defineProps<{
    total: number;
    itemsPerPage?: number;
    siblingCount?: number;
    showEdges?: boolean;
    disabled?: boolean;
    class?: HTMLAttributes['class'];
}>(), {
    itemsPerPage: 10,
    siblingCount: 1,
    showEdges: true,
    disabled: false,
});

// Current page (1-based, v-model:page)
const page = defineModel<number>('page', { default: 1 });
</script>

<template>
    <Pagination v-model:page="page" :total="props.total" :items-per-page="props.itemsPerPage" :sibling-count="props.siblingCount" :show-edges="props.showEdges" :disabled="props.disabled" :class="props.class">
        <PaginationContent v-slot="{ items }">
            <!-- Jump to start / previous -->
            <PaginationFirst class="hidden sm:inline-flex" />
            <PaginationPrevious />

            <!-- Page numbers and gaps -->
            <template v-for="(item, index) in items" :key="item.type === 'page' ? `page-${item.value}` : `ellipsis-${index}`">
                <PaginationItem v-if="item.type === 'page'" :value="item.value" />
                <PaginationEllipsis v-else />
            </template>

            <!-- Next / jump to end -->
            <PaginationNext />
            <PaginationLast class="hidden sm:inline-flex" />
        </PaginationContent>
    </Pagination>
</template>