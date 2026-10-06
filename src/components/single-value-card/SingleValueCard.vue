<script setup lang="ts">
import { computed } from 'vue';
import type { HTMLAttributes } from 'vue';
import { ArrowDownRight01Icon, ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { AnimatedNumber } from '../ui/animated-number';
import { Card } from '../ui/card';
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
    <Card :class="cn('gap-0! p-4! sm:gap-0!', props.class)">
        <!-- Label and icon -->
        <div class="flex items-start justify-between gap-3">
            <span class="min-w-0 text-[11px] font-semibold leading-5 tracking-wider text-muted-foreground uppercase">
                {{ props.label }}
            </span>
            <span aria-hidden="true" class="flex size-8 shrink-0 items-center justify-center rounded border border-primary/30 text-primary">
                <HugeiconsIcon :icon="props.icon" class="size-4" />
            </span>
        </div>

        <!-- Value and trend -->
        <div class="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span :class="['text-2xl font-semibold tracking-tight tabular-nums', valueClass]">
                <AnimatedNumber v-if="props.animate && typeof props.value === 'number'" :value="props.value" :format-options="props.formatOptions" />
                <template v-else>{{ props.value }}</template>
            </span>

            <!-- Trend badge -->
            <span v-if="props.trend !== null" :class="cn('inline-flex items-center gap-0.5 rounded-sm px-1 py-0.5 text-[11px] font-semibold tabular-nums', trendIsPositive ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400')">
                <HugeiconsIcon :icon="trendIsPositive ? ArrowUpRight01Icon : ArrowDownRight01Icon" class="size-3" />
                {{ formattedTrend }}
            </span>
            <span v-if="props.trend !== null && props.trendLabel" class="text-[11px] text-muted-foreground">
                {{ props.trendLabel }}
            </span>
        </div>

        <!-- Description -->
        <span v-if="props.description" class="mt-1 text-xs leading-5 text-muted-foreground">
            {{ props.description }}
        </span>
    </Card>
</template>
