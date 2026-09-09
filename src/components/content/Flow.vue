<script setup lang="ts">
import { ArrowDown01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

type FlowItem = string | {
    label?: string;
    title?: string;
    description?: string;
};

// Props
const props = withDefaults(defineProps<{
    title?: string;
    description?: string;
    items?: FlowItem[];
    orientation?: 'horizontal' | 'vertical';
}>(), {
    title: '',
    description: '',
    items: () => [],
    orientation: 'horizontal'
});

// Get item label
const getItemLabel = (item: FlowItem) => {
    if (typeof item === 'string') return item;
    return item.label || item.title || '';
};

// Get item description
const getItemDescription = (item: FlowItem) => {
    if (typeof item === 'string') return '';
    return item.description || '';
};

// Check if orientation is vertical
const isVertical = () => {
    return props.orientation === 'vertical';
};
</script>

<template>
    <div class="not-prose my-6 sm:my-8">
        <Card>
            <!-- Card header -->
            <CardHeader v-if="props.title || props.description">
                <!-- Card title -->
                <CardTitle v-if="props.title">
                    {{ props.title }}
                </CardTitle>

                <!-- Card description -->
                <CardDescription v-if="props.description">
                    {{ props.description }}
                </CardDescription>
            </CardHeader>

            <!-- Card content -->
            <CardContent>
                <div :class="[isVertical() ? 'flex flex-col gap-3' : 'flex flex-col gap-3 md:flex-row md:items-stretch']">
                    <!-- Flow items -->
                    <template v-for="(item, index) in props.items" :key="`${getItemLabel(item)}-${index}`">
                        <!-- Flow item -->
                        <Card class="flex-1 overflow-hidden md:flex md:items-center">
                            <CardContent class="w-full gap-3 md:justify-center">
                                <!-- Flow item header -->
                                <div class="inline-flex items-center gap-3 text-xs font-semibold text-(--text-primary-light) dark:text-(--text-primary-dark)">
                                    <!-- Flow item number -->
                                    <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded border border-(--border-light) bg-(--bg-card-light) text-xs font-semibold text-(--text-secondary-light) dark:border-(--border-dark) dark:bg-(--bg-card-dark) dark:text-(--text-secondary-dark)">
                                        {{ index + 1 }}
                                    </span>

                                    <!-- Flow item label -->
                                    <span>{{ getItemLabel(item) }}</span>
                                </div>

                                <!-- Flow item description -->
                                <p v-if="getItemDescription(item)" class="text-xs leading-6 text-(--text-secondary-light) dark:text-(--text-secondary-dark) md:leading-5">
                                    {{ getItemDescription(item) }}
                                </p>
                            </CardContent>
                        </Card>

                        <!-- Flow item separator -->
                        <div v-if="index < props.items.length - 1" class="flex items-center justify-center text-(--text-secondary-light) dark:text-(--text-secondary-dark)">
                            <!-- Flow item separator for vertical orientation -->
                            <HugeiconsIcon v-if="isVertical()" :icon="ArrowDown01Icon" class="size-5 shrink-0" />

                            <!-- Flow item separator for horizontal orientation -->
                            <HugeiconsIcon v-else :icon="ArrowRight01Icon" class="hidden size-5 shrink-0 md:block" />
                            <HugeiconsIcon v-if="!isVertical()" :icon="ArrowDown01Icon" class="size-5 shrink-0 md:hidden" />
                        </div>
                    </template>
                </div>
            </CardContent>
        </Card>
    </div>
</template>