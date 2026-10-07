<script setup lang="ts" generic="T extends Record<string, any>">
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowUp01Icon, PackageIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { cn } from '../../../lib/utils';
import { Checkbox } from '../checkbox';
import { Skeleton } from '../skeleton';
import type { DataTableColumn, DataTableSort } from '.';

// Props
const props = withDefaults(defineProps<{
    columns: DataTableColumn<T>[];
    rows: T[];
    rowKey?: keyof T | ((row: T) => PropertyKey);
    selectable?: boolean;
    selected?: PropertyKey[];
    sort?: DataTableSort | null;
    manualSort?: boolean;
    loading?: boolean;
    loadingRows?: number;
    emptyText?: string;
    rowClickable?: boolean;
    stickyHeader?: boolean;
    class?: HTMLAttributes['class'];
}>(), {
    rowKey: 'id' as never,
    selectable: false,
    selected: () => [],
    sort: null,
    manualSort: false,
    loading: false,
    loadingRows: 5,
    emptyText: '',
    rowClickable: false,
    stickyHeader: false
});

// Emits
const emits = defineEmits<{
    'update:selected': [value: PropertyKey[]];
    'update:sort': [value: DataTableSort | null];
    'row-click': [row: T, event: MouseEvent | KeyboardEvent];
}>();

// Slots
defineSlots<{
    [key: `cell-${string}`]: (props: { row: T; value: unknown; index: number }) => unknown;
    [key: `header-${string}`]: (props: { column: DataTableColumn<T> }) => unknown;
    empty?: () => unknown;
}>();

const { t } = useI18n();
const resolvedEmptyText = computed(() => props.emptyText || t('uiVintage.common.empty.description'));

// Resolve a stable key for each row
const getRowKey = (row: T): PropertyKey => {
    return typeof props.rowKey === 'function' ? props.rowKey(row) : row[props.rowKey as keyof T] as PropertyKey;
};

// Read the raw value of a cell
const getCellValue = (row: T, column: DataTableColumn<T>) => row[column.key];

// Format a cell for display when no slot is provided
const formatCell = (row: T, column: DataTableColumn<T>) => {
    const value = getCellValue(row, column);
    return column.format ? column.format(value, row) : value ?? '';
};

// Sort rows on the client unless sorting is delegated to the parent
const sortedRows = computed(() => {
    if (!props.sort || props.manualSort) return props.rows;
    const column = props.columns.find(item => item.key === props.sort?.key);
    if (!column) return props.rows;
    const direction = props.sort.direction === 'asc' ? 1 : -1;
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

    // Compare values with the column accessor (strings use natural ordering)
    return [...props.rows].sort((first, second) => {
        const firstValue = column.sortValue ? column.sortValue(first) : getCellValue(first, column);
        const secondValue = column.sortValue ? column.sortValue(second) : getCellValue(second, column);
        if (firstValue == null) return 1;
        if (secondValue == null) return -1;
        if (typeof firstValue === 'number' && typeof secondValue === 'number') return (firstValue - secondValue) * direction;
        return collator.compare(String(firstValue), String(secondValue)) * direction;
    });
});

// Cycle a column through ascending, descending, and unsorted
const toggleSort = (column: DataTableColumn<T>) => {
    if (!column.sortable) return;
    if (props.sort?.key !== column.key) {
        emits('update:sort', { key: column.key, direction: 'asc' });
    } else if (props.sort.direction === 'asc') {
        emits('update:sort', { key: column.key, direction: 'desc' });
    } else {
        emits('update:sort', null);
    }
};

// Selection helpers
const selectedSet = computed(() => new Set(props.selected));
const allSelected = computed(() => props.rows.length > 0 && props.rows.every(row => selectedSet.value.has(getRowKey(row))));
const someSelected = computed(() => props.rows.some(row => selectedSet.value.has(getRowKey(row))));
const headerCheckboxState = computed(() => allSelected.value ? true : someSelected.value ? 'indeterminate' : false);

// Toggle all rows
const toggleAll = () => {
    emits('update:selected', allSelected.value ? [] : props.rows.map(getRowKey));
};

// Toggle a single row
const toggleRow = (row: T) => {
    const key = getRowKey(row);
    const next = new Set(props.selected);
    if (next.has(key)) {
        next.delete(key);
    } else {
        next.add(key);
    }
    emits('update:selected', [...next]);
};

// Alignment classes for header and body cells
const alignClasses = { left: 'text-left', center: 'text-center', right: 'text-right' } as const;
const justifyClasses = { left: 'justify-start', center: 'justify-center', right: 'justify-end' } as const;
const columnCount = computed(() => props.columns.length + (props.selectable ? 1 : 0));

// Emit row clicks (ignoring clicks on interactive children)
const handleRowClick = (row: T, event: MouseEvent) => {
    if ((event.target as HTMLElement).closest('button, a, input, [role=checkbox]')) return;
    emits('row-click', row, event);
};

// Let keyboard users activate a focused clickable row with Enter or Space
const handleRowKeydown = (row: T, event: KeyboardEvent) => {
    if (!props.rowClickable || event.target !== event.currentTarget) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    emits('row-click', row, event);
};
</script>

<template>
    <div data-slot="data-table" :class="cn('relative w-full overflow-auto rounded border border-border bg-card shadow-elevated-sm', props.class)">
        <table class="w-full caption-bottom border-collapse text-sm">
            <!-- Header -->
            <thead :class="cn('bg-surface/80 backdrop-blur', props.stickyHeader && 'sticky top-0 z-10')">
                <tr class="border-b border-border">
                    <!-- Select all -->
                    <th v-if="props.selectable" class="w-12 px-4 py-3">
                        <Checkbox :model-value="headerCheckboxState" :aria-label="t('uiVintage.dataTable.selectAll')" @update:model-value="toggleAll" />
                    </th>

                    <!-- Column headers -->
                    <th v-for="column in props.columns" :key="column.key" :style="column.width ? { width: column.width } : undefined" :aria-sort="props.sort?.key === column.key ? (props.sort.direction === 'asc' ? 'ascending' : 'descending') : undefined" :class="cn('h-11 px-4 text-xs font-semibold whitespace-nowrap text-muted-foreground', alignClasses[column.align ?? 'left'], column.headerClass)">
                        <slot :name="`header-${column.key}`" :column="column">
                            <button v-if="column.sortable" type="button" :class="cn('group/sort -mx-1.5 inline-flex cursor-pointer items-center gap-1.5 rounded-sm px-1.5 py-1 outline-none transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/45', props.sort?.key === column.key && 'text-foreground', justifyClasses[column.align ?? 'left'])" @click="toggleSort(column)">
                                {{ column.label }}
                                <HugeiconsIcon :icon="ArrowUp01Icon" :class="cn('size-3.5 transition-[rotate,opacity,color] duration-300 ease-spring', props.sort?.key === column.key ? 'text-primary opacity-100' : 'opacity-0 group-hover/sort:opacity-50', props.sort?.key === column.key && props.sort.direction === 'desc' && 'rotate-180')" />
                            </button>
                            <template v-else>
                                {{ column.label }}
                            </template>
                        </slot>
                    </th>
                </tr>
            </thead>

            <!-- Loading rows -->
            <tbody v-if="props.loading">
                <tr v-for="index in props.loadingRows" :key="`loading-${index}`" class="border-b border-border last:border-b-0">
                    <td v-if="props.selectable" class="px-4 py-3">
                        <Skeleton class="size-5" />
                    </td>
                    <td v-for="column in props.columns" :key="column.key" class="px-4 py-3">
                        <Skeleton class="h-4" :style="{ width: `${45 + ((index * 17 + column.key.length * 11) % 45)}%` }" />
                    </td>
                </tr>
            </tbody>

            <!-- Empty state -->
            <tbody v-else-if="sortedRows.length === 0">
                <tr>
                    <td :colspan="columnCount" class="px-4 py-12">
                        <slot name="empty">
                            <div class="flex flex-col items-center gap-2 text-center text-muted-foreground">
                                <HugeiconsIcon :icon="PackageIcon" class="size-8 opacity-40" />
                                <span class="text-xs sm:text-sm">{{ resolvedEmptyText }}</span>
                            </div>
                        </slot>
                    </td>
                </tr>
            </tbody>

            <!-- Rows (animated when sorted, added, or removed) -->
            <TransitionGroup v-else tag="tbody" name="uv-data-table-row">
                <tr v-for="(row, index) in sortedRows" :key="getRowKey(row)" :data-state="selectedSet.has(getRowKey(row)) ? 'selected' : undefined" :class="cn('border-b border-border transition-colors duration-150 last:border-b-0 hover:bg-surface/70 data-[state=selected]:bg-primary/5', props.rowClickable && 'cursor-pointer focus-visible:bg-surface/70 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring')" :tabindex="props.rowClickable ? 0 : undefined" @click="handleRowClick(row, $event)" @keydown="handleRowKeydown(row, $event)">
                    <!-- Row selection -->
                    <td v-if="props.selectable" class="px-4 py-3">
                        <Checkbox :model-value="selectedSet.has(getRowKey(row))" :aria-label="t('uiVintage.dataTable.selectRow')" @update:model-value="toggleRow(row)" />
                    </td>

                    <!-- Cells -->
                    <td v-for="column in props.columns" :key="column.key" :class="cn('px-4 py-3 align-middle text-xs whitespace-nowrap md:text-sm', alignClasses[column.align ?? 'left'], column.class)">
                        <slot :name="`cell-${column.key}`" :row="row" :value="getCellValue(row, column)" :index="index">
                            {{ formatCell(row, column) }}
                        </slot>
                    </td>
                </tr>
            </TransitionGroup>
        </table>
    </div>
</template>

<style>
.uv-data-table-row-move {
    transition: transform 0.45s var(--ease-spring);
}

.uv-data-table-row-enter-active {
    transition: opacity 0.3s var(--ease-out-expo), transform 0.4s var(--ease-spring);
}

.uv-data-table-row-leave-active {
    transition: opacity 0.18s var(--ease-snappy);
}

.uv-data-table-row-enter-from {
    opacity: 0;
    transform: translateY(-6px);
}

.uv-data-table-row-leave-to {
    opacity: 0;
}
</style>