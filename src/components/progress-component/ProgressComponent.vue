<script setup lang="ts">
import { Progress } from '@/components/ui/progress';

// Props
const props = defineProps({
    title: { type: String, required: true },
    bottomLeftLabel: { type: String, default: '' },
    bottomRightLabel: { type: String, default: '' },
    value: { type: Number, required: true },
    max: { type: Number, required: true }
});
</script>

<template>
    <div class="space-y-3">
        <!-- Header with icon and label -->
        <div class="flex items-center justify-between">
            <!-- Title of the progress bar -->
            <span class="text-sm font-medium text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)]">
                {{ props.title }}
            </span>

            <!-- Current value / max -->
            <span class="text-sm font-medium text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)]">
                {{ props.value }} / {{ props.max }}
            </span>
        </div>

        <!-- Progress bar -->
        <Progress :model-value="props.value" :max="props.max" />

        <!-- Bottom labels -->
        <div v-if="props.bottomLeftLabel || props.bottomRightLabel" class="flex items-center justify-between text-xs">
            <!-- Bottom left label -->
            <span v-if="props.bottomLeftLabel" class="text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]">
                {{ props.bottomLeftLabel }}
            </span>

            <!-- Bottom right label -->
            <span v-if="props.bottomRightLabel" class="text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]">
                {{ props.bottomRightLabel }}
            </span>
        </div>
    </div>
</template>