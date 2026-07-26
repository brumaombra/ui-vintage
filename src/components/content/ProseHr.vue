<script setup lang="ts">
import { ChartLineData02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';

type HugeiconsIconDefinition = readonly (readonly [string, { readonly [key: string]: string | number }])[];

// Props
const props = withDefaults(defineProps<{
    icon?: HugeiconsIconDefinition;
}>(), {
    icon: () => ChartLineData02Icon
});
</script>

<template>
    <div aria-hidden="true" class="not-prose my-6 sm:my-12">
        <div class="flex items-center gap-3 sm:gap-4">
            <!-- Left line -->
            <div class="h-px flex-1 bg-linear-to-r from-transparent via-(--border-light) to-(--border-light) dark:via-(--border-dark) dark:to-(--border-dark)" />

            <!-- Icon in the middle -->
            <div class="flex h-9 w-9 items-center justify-center rounded bg-(--bg-card-light) dark:bg-(--bg-card-dark) border border-(--border-light) dark:border-(--border-dark)">
                <HugeiconsIcon :icon="props.icon" class="size-4 text-(--text-secondary-light) dark:text-(--text-secondary-dark)" />
            </div>

            <!-- Right line -->
            <div class="h-px flex-1 bg-linear-to-l from-transparent via-(--border-light) to-(--border-light) dark:via-(--border-dark) dark:to-(--border-dark)" />
        </div>
    </div>
</template>