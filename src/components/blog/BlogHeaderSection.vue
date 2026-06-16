<script setup>
import { Badge } from '../ui/badge';

// Props
const props = defineProps({
    badges: {
        type: Array,
        default: () => []
    },
    title: { type: String, required: true },
    description: { type: String, required: true }
});
</script>

<template>
    <div class="flex flex-col space-y-6 md:!space-y-8">
        <!-- Badges -->
        <div v-if="props.badges.length > 0" class="flex flex-wrap gap-3 mb-6 md:mb-8">
            <Badge v-for="badge in props.badges"
                :key="`${badge.color}-${badge.text}`"
                :color="badge.color"
                :text="badge.text" />
        </div>

        <!-- Title -->
        <h1 class="text-3xl md:text-6xl font-bold text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] leading-tight">
            {{ props.title }}
        </h1>

        <!-- Description -->
        <p class="text-sm md:text-xl text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)] leading-relaxed">
            {{ props.description }}
        </p>
    </div>
</template>