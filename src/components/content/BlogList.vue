<script setup lang="ts">
import { Cancel01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card } from '../ui/card';

// Props
const props = withDefaults(defineProps<{
    items?: string[];
    variant?: 'circle' | 'checkmark' | 'numbered' | 'cross';
}>(), {
    items: () => [],
    variant: 'checkmark'
});

// Marker classes
const getMarkerClasses = () => {
    const toneClasses = {
        checkmark: 'rounded bg-green-500/10 text-green-600 dark:text-green-400',
        cross: 'rounded bg-red-500/10 text-red-600 dark:text-red-400',
        numbered: 'text-[11px] font-semibold tabular-nums text-primary',
        circle: ''
    };
    return ['mt-px flex size-5 shrink-0 items-center justify-center', toneClasses[props.variant]];
};

// Format the item number with a leading zero
const formatNumber = (index: number) => {
    return String(index + 1).padStart(2, '0');
};
</script>

<template>
    <div class="not-prose my-6 sm:my-8">
        <Card data-aos="blur-up" class="gap-0! py-0! overflow-hidden">
            <ul class="divide-y divide-border">
                <li v-for="(item, index) in props.items" :key="index" data-aos="blur-up" :data-aos-delay="100 + index * 80" class="flex items-start gap-3 px-4 py-3.5 text-xs leading-relaxed text-foreground sm:px-5 md:text-sm">
                    <!-- Marker -->
                    <span aria-hidden="true" :class="getMarkerClasses()">
                        <HugeiconsIcon v-if="props.variant === 'checkmark'" :icon="Tick02Icon" :stroke-width="2.5" class="size-3" />
                        <HugeiconsIcon v-else-if="props.variant === 'cross'" :icon="Cancel01Icon" :stroke-width="2.5" class="size-3" />
                        <template v-else-if="props.variant === 'numbered'">{{ formatNumber(index) }}</template>
                        <span v-else class="size-1.5 rounded-full bg-primary" />
                    </span>

                    <!-- Content -->
                    <span class="flex-1">{{ item }}</span>
                </li>
            </ul>
        </Card>
    </div>
</template>
