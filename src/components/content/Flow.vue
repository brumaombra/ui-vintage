<script setup lang="ts">
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

// Format the step number with a leading zero
const formatNumber = (index: number) => {
    return String(index + 1).padStart(2, '0');
};
</script>

<template>
    <div class="not-prose my-6 sm:my-8">
        <Card data-aos="blur-up">
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
                <ol :class="['flex flex-col', !isVertical() && 'md:flex-row md:gap-4']">
                    <!-- Flow step -->
                    <li v-for="(item, index) in props.items"
                        :key="`${getItemLabel(item)}-${index}`"
                        data-aos="blur-up"
                        :data-aos-delay="100 + index * 90"
                        :class="['relative flex gap-4 pb-6 last:pb-0', !isVertical() && 'md:flex-1 md:flex-col md:gap-3 md:pb-0']">
                        <!-- Step number -->
                        <span class="relative z-10 flex size-7 shrink-0 items-center justify-center rounded border border-primary/30 bg-card text-[11px] font-semibold tabular-nums text-primary">
                            {{ formatNumber(index) }}
                        </span>

                        <!-- Connector to the next step -->
                        <span v-if="index < props.items.length - 1"
                            aria-hidden="true"
                            :class="['absolute top-8 bottom-1 left-3.5 w-px bg-border', !isVertical() && 'md:top-3.5 md:bottom-auto md:left-10 md:-right-2 md:h-px md:w-auto md:bg-linear-to-r md:from-primary/40 md:to-border']" />

                        <!-- Step text -->
                        <div :class="['flex min-w-0 flex-col gap-1 pt-1', !isVertical() && 'md:pt-0']">
                            <span class="text-xs font-semibold leading-5 text-foreground md:text-sm">{{ getItemLabel(item) }}</span>
                            <p v-if="getItemDescription(item)" class="text-xs leading-5 text-muted-foreground">
                                {{ getItemDescription(item) }}
                            </p>
                        </div>
                    </li>
                </ol>
            </CardContent>
        </Card>
    </div>
</template>
