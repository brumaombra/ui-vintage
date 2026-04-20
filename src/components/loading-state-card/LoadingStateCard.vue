<script setup lang="ts">
import { Loading03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card, CardContent } from '@/components/ui/card';

// Props
const props = defineProps({
    icon: { type: [Object, Array], default: () => Loading03Icon },
    title: { type: String, default: '' },
    description: { type: String, default: '' }
});
</script>

<template>
    <Card class="flex flex-col items-center justify-center px-4 py-8 text-center md:py-12">
        <CardContent class="flex flex-col items-center justify-center !p-0 text-center">
            <!-- Loading spinner icon -->
            <div class="flex items-center justify-center text-4xl text-[var(--text-secondary-light)] opacity-60 dark:text-[var(--text-secondary-dark)]">
                <HugeiconsIcon :icon="props.icon" class="size-10 animate-spin" />
            </div>

            <!-- Title -->
            <h3 v-if="props.title" class="text-sm font-bold text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] md:text-lg">
                {{ props.title }}
            </h3>

            <!-- Description -->
            <p v-if="props.description" class="max-w-md text-xs text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)] md:text-sm">
                {{ props.description }}
            </p>

            <!-- Slot for additional content -->
            <slot />
        </CardContent>
    </Card>
</template>