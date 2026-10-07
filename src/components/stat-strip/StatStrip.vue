<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { AnimatedNumber } from '../ui/animated-number';
import { cn } from '../../lib/utils';
import type { HugeiconsIconDefinition } from '../../lib/common-types';

// Props
const props = withDefaults(defineProps<{
    items: Array<{
        label: string;
        value: string | number;
        icon?: HugeiconsIconDefinition;
        formatOptions?: Intl.NumberFormatOptions;
    }>;
    animate?: boolean;
    class?: HTMLAttributes['class'];
}>(), {
    animate: true
});
</script>

<template>
    <!-- Compact row of stats in one bordered strip -->
    <ul v-if="props.items.length > 0" data-slot="stat-strip" :class="cn('inline-flex max-w-full flex-wrap items-stretch overflow-hidden rounded border border-border bg-card text-xs shadow-elevated-sm', props.class)">
        <li v-for="(item, index) in props.items" :key="item.label" :class="['flex items-center gap-2 px-4 py-2.5', index > 0 && 'border-l border-border']">
            <HugeiconsIcon v-if="item.icon" :icon="item.icon" class="size-4 shrink-0 text-primary" />
            <span class="font-semibold text-foreground tabular-nums">
                <AnimatedNumber v-if="props.animate && typeof item.value === 'number'" :value="item.value" :format-options="item.formatOptions" />
                <template v-else-if="typeof item.value === 'number'">{{ new Intl.NumberFormat(undefined, item.formatOptions).format(item.value) }}</template>
                <template v-else>{{ item.value }}</template>
            </span>
            <span class="text-muted-foreground">{{ item.label }}</span>
        </li>
    </ul>
</template>
