<script setup lang="ts">
import { computed } from 'vue';
import type { HTMLAttributes } from 'vue';
import { ArrowDownRight01Icon, ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { AnimatedNumber } from '../ui/animated-number';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';
import type { HugeiconsIconDefinition } from '../../lib/common-types';

// Props
const props = withDefaults(defineProps<{
    value: string | number;
    label: string;
    icon: HugeiconsIconDefinition;
    valueColor?: 'default' | 'green' | 'red' | 'gray';
    trend?: number | null;
    trendLabel?: string;
    description?: string;
    animate?: boolean;
    formatOptions?: Intl.NumberFormatOptions;
    class?: HTMLAttributes['class'];
}>(), {
    valueColor: 'default',
    trend: null,
    trendLabel: '',
    description: '',
    animate: true,
    formatOptions: undefined
});

// Value classes
const valueClass = computed(() => {
    switch (props.valueColor) {
        case 'green':
            return 'text-green-600 dark:text-green-400';
        case 'red':
            return 'text-red-600 dark:text-red-400';
        case 'gray':
            return 'text-gray-600 dark:text-gray-400';
        default:
            return 'text-foreground';
    }
});

// Trend badge presentation
const trendIsPositive = computed(() => (props.trend ?? 0) >= 0);
const formattedTrend = computed(() => `${trendIsPositive.value ? '+' : ''}${props.trend}%`);
</script>

<template>
    <Card :class="cn('group/stat flex-row items-center p-4!', props.class)">
        <CardContent class="w-full flex-row items-center gap-0 p-0!">
            <!-- Icon -->
            <Card color="gray" class="mr-4 flex size-12 shrink-0 items-center justify-center p-0! transition-[rotate,scale,border-color] duration-500 ease-bounce group-hover/stat:-rotate-6 group-hover/stat:scale-105 group-hover/stat:border-primary/50">
                <HugeiconsIcon :icon="props.icon" class="size-5 transition-colors duration-300 group-hover/stat:text-primary" />
            </Card>

            <!-- Content -->
            <div class="flex min-w-0 flex-1 flex-col">
                <!-- Label -->
                <span class="mb-1 truncate text-xs font-semibold text-muted-foreground">
                    {{ props.label }}
                </span>

                <!-- Value and trend -->
                <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span :class="['text-2xl font-bold md:text-xl', valueClass]">
                        <AnimatedNumber v-if="props.animate && typeof props.value === 'number'" :value="props.value" :format-options="props.formatOptions" />
                        <template v-else>{{ props.value }}</template>
                    </span>

                    <!-- Trend badge -->
                    <span v-if="props.trend !== null" :class="cn('inline-flex items-center gap-0.5 rounded-sm px-1 py-0.5 text-[11px] font-bold', trendIsPositive ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400')">
                        <HugeiconsIcon :icon="trendIsPositive ? ArrowUpRight01Icon : ArrowDownRight01Icon" class="size-3" />
                        {{ formattedTrend }}
                    </span>
                    <span v-if="props.trend !== null && props.trendLabel" class="text-[11px] text-muted-foreground">
                        {{ props.trendLabel }}
                    </span>
                </div>

                <!-- Description -->
                <span v-if="props.description" class="mt-1 text-xs text-muted-foreground">
                    {{ props.description }}
                </span>
            </div>
        </CardContent>
    </Card>
</template>