<script setup lang="ts">
import { Card, CardContent } from '../ui/card';
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
    const baseClasses = 'text-left font-semibold text-foreground';
    const highlightClass = props.highlightCol === colIndex ? 'bg-accent' : '';
    return [baseClasses, highlightClass];
};

// Body cell classes
const getCellClasses = (colIndex: number) => {
    const baseClasses = 'align-top text-foreground leading-relaxed whitespace-normal';
    const firstColClass = colIndex === 0 ? 'font-semibold text-muted-foreground' : '';
    const highlightClass = props.highlightCol === colIndex ? 'bg-accent' : '';
    return [baseClasses, firstColClass, highlightClass];
};
</script>

<template>
    <div class="not-prose my-6 sm:my-8">
        <Card>
            <CardContent>
                <div class="w-full overflow-x-auto">
                    <Table class="w-full text-sm text-left">
                        <!-- Table header -->
                        <TableHeader>
                            <TableRow class="bg-transparent text-sm text-muted-foreground hover:bg-transparent">
                                <TableHead v-for="(header, colIndex) in props.headers" :key="colIndex" :class="getHeaderClasses(colIndex)">
                                    {{ header }}
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <!-- Table body -->
                        <TableBody>
                            <TableRow v-for="(row, rowIndex) in props.rows" :key="rowIndex" class="text-muted-foreground hover:bg-transparent">
                                <TableCell v-for="(cell, colIndex) in row" :key="colIndex" :class="getCellClasses(colIndex)">
                                    {{ cell }}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    </div>
</template>