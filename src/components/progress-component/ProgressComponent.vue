<script setup lang="ts">
import { Progress } from '../ui/progress';

// Props
const props = withDefaults(defineProps<{
    title: string;
    bottomLeftLabel?: string;
    bottomRightLabel?: string;
    value: number;
    max: number;
}>(), {
    bottomLeftLabel: '',
    bottomRightLabel: ''
});
</script>

<template>
    <div class="space-y-3">
        <!-- Header with icon and label -->
        <div class="flex items-center justify-between">
            <!-- Title of the progress bar -->
            <span class="text-sm font-semibold text-(--text-primary-light) dark:text-(--text-primary-dark)">
                {{ props.title }}
            </span>

            <!-- Current value / max -->
            <span class="text-sm font-semibold text-(--text-primary-light) dark:text-(--text-primary-dark)">
                {{ props.value }} / {{ props.max }}
            </span>
        </div>

        <!-- Progress bar -->
        <Progress :model-value="props.value" :max="props.max" />

        <!-- Bottom labels -->
        <div v-if="props.bottomLeftLabel || props.bottomRightLabel" class="flex items-center justify-between text-xs">
            <!-- Bottom left label -->
            <span v-if="props.bottomLeftLabel" class="text-(--text-secondary-light) dark:text-(--text-secondary-dark)">
                {{ props.bottomLeftLabel }}
            </span>

            <!-- Bottom right label -->
            <span v-if="props.bottomRightLabel" class="text-(--text-secondary-light) dark:text-(--text-secondary-dark)">
                {{ props.bottomRightLabel }}
            </span>
        </div>
    </div>
</template>