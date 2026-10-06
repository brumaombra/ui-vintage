<script setup lang="ts">
import { Card } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

// Props
const props = withDefaults(defineProps<{
    headers?: string[];
    rows?: string[][];
    highlightCol?: number;
}>(), {
    headers: () => [],
    rows: () => [],
    highlightCol: -1
});

// Header cell classes
const getHeaderClasses = (colIndex: number) => {
    const baseClasses = 'h-10 px-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:px-5';
    const highlightClass = props.highlightCol === colIndex ? 'text-primary shadow-[inset_0_-2px_0_var(--primary)]' : '';
    return [baseClasses, highlightClass];
};

// Body cell classes
const getCellClasses = (colIndex: number) => {
    const baseClasses = 'min-w-32 px-4 py-3 align-top leading-relaxed whitespace-normal sm:px-5';
    const firstColClass = colIndex === 0 ? 'font-medium text-foreground' : 'text-muted-foreground';
    const highlightClass = props.highlightCol === colIndex ? 'bg-primary/5 text-foreground' : '';
    return [baseClasses, firstColClass, highlightClass];
};
</script>

<template>
    <div class="not-prose my-6 sm:my-8">
        <Card data-aos="blur-up" class="gap-0! py-0! overflow-hidden">
            <Table class="w-full text-left text-sm">
                <!-- Table header -->
                <TableHeader>
                    <TableRow class="bg-surface hover:bg-surface">
                        <TableHead v-for="(header, colIndex) in props.headers" :key="colIndex" :class="getHeaderClasses(colIndex)">
                            {{ header }}
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <!-- Table body -->
                <TableBody>
                    <TableRow v-for="(row, rowIndex) in props.rows" :key="rowIndex" class="last:border-b-0 hover:bg-surface/60">
                        <TableCell v-for="(cell, colIndex) in row" :key="colIndex" :class="getCellClasses(colIndex)">
                            {{ cell }}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Card>
    </div>
</template>
