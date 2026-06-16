<script setup>
import { ChartLineData02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';

// Props
const props = defineProps({
    icon: { type: Object, default: () => ChartLineData02Icon }
});
</script>

<template>
    <div aria-hidden="true" class="not-prose my-6 sm:my-12">
        <div class="flex items-center gap-3 sm:gap-4">
            <!-- Left line -->
            <div class="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border-light)] to-[var(--border-light)] dark:via-[var(--border-dark)] dark:to-[var(--border-dark)]" />

            <!-- Icon in the middle -->
            <div class="flex h-9 w-9 items-center justify-center rounded bg-[var(--bg-card-light)] dark:bg-[var(--bg-card-dark)] border border-[var(--border-light)] dark:border-[var(--border-dark)]">
                <HugeiconsIcon :icon="props.icon" class="size-4 text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]" />
            </div>

            <!-- Right line -->
            <div class="h-px flex-1 bg-gradient-to-l from-transparent via-[var(--border-light)] to-[var(--border-light)] dark:via-[var(--border-dark)] dark:to-[var(--border-dark)]" />
        </div>
    </div>
</template>