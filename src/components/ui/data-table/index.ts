export { default as DataTable } from './DataTable.vue';

export type DataTableSortDirection = 'asc' | 'desc';

export interface DataTableSort {
    key: string;
    direction: DataTableSortDirection;
}

export interface DataTableColumn<T> {
    key: string;
    label: string;
    sortable?: boolean;
    align?: 'left' | 'center' | 'right';
    width?: string;
    class?: string;
    headerClass?: string;
    format?: (value: unknown, row: T) => string;
    sortValue?: (row: T) => string | number | null | undefined;
}