<script setup lang="ts">
import { computed } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card, CardContent } from '../ui/card';

type HugeiconsIconDefinition = readonly (readonly [string, { readonly [key: string]: string | number }])[];

// Props
const props = withDefaults(defineProps<{
    value: string | number;
    label: string;
    icon: HugeiconsIconDefinition;
    valueColor?: 'default' | 'green' | 'red' | 'gray';
}>(), {
    valueColor: 'default'
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
            return 'text-(--text-primary-light) dark:text-(--text-primary-dark)';
    }
});
</script>

<template>
    <Card class="flex-row items-center p-4!">
        <CardContent class="flex-row items-center gap-0 p-0!">
            <!-- Icon -->
            <Card color="gray" class="mr-4 flex h-12 w-12 shrink-0 items-center justify-center p-0!">
                <HugeiconsIcon :icon="props.icon" class="size-5" />
            </Card>

            <!-- Content -->
            <div class="flex flex-col">
                <!-- Label -->
                <span class="mb-1 text-xs font-semibold text-(--text-secondary-light) dark:text-(--text-secondary-dark)">
                    {{ props.label }}
                </span>

                <!-- Value -->
                <span :class="['text-2xl md:text-xl font-bold', valueClass]">
                    {{ props.value }}
                </span>
            </div>
        </CardContent>
    </Card>
</template>