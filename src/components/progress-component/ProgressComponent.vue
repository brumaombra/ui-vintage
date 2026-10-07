<script setup lang="ts">
import { useId } from 'vue';
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

// Name the progress bar after the visible title
const titleId = useId();
</script>

<template>
    <div class="space-y-3">
        <!-- Header with label and value -->
        <div class="flex items-center justify-between">
            <!-- Title of the progress bar -->
            <span :id="titleId" class="text-sm font-semibold text-foreground">
                {{ props.title }}
            </span>

            <!-- Current value / max -->
            <span class="text-sm font-semibold text-foreground">
                {{ props.value }} / {{ props.max }}
            </span>
        </div>

        <!-- Progress bar -->
        <Progress :model-value="props.value" :max="props.max" :aria-labelledby="titleId" />

        <!-- Bottom labels -->
        <div v-if="props.bottomLeftLabel || props.bottomRightLabel" class="flex items-center justify-between text-xs">
            <!-- Bottom left label -->
            <span v-if="props.bottomLeftLabel" class="text-muted-foreground">
                {{ props.bottomLeftLabel }}
            </span>

            <!-- Bottom right label -->
            <span v-if="props.bottomRightLabel" class="text-muted-foreground">
                {{ props.bottomRightLabel }}
            </span>
        </div>
    </div>
</template>