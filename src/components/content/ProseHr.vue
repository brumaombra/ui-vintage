<script setup lang="ts">
import { ChartLineData02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import type { HugeiconsIconDefinition } from '../../lib/common-types';

// Props
const props = withDefaults(defineProps<{
    icon?: HugeiconsIconDefinition;
}>(), {
    icon: () => ChartLineData02Icon
});
</script>

<template>
    <div aria-hidden="true" data-aos="blur-up" class="not-prose my-8 sm:my-14">
        <div class="flex items-center gap-3 sm:gap-4">
            <!-- Left line -->
            <div class="h-px flex-1 bg-linear-to-r from-transparent via-border to-primary/50" />

            <!-- Icon in the middle -->
            <div class="flex size-8 rotate-45 items-center justify-center rounded border border-primary/30 bg-card shadow-glow">
                <HugeiconsIcon :icon="props.icon" class="size-3.5 -rotate-45 text-primary" />
            </div>

            <!-- Right line -->
            <div class="h-px flex-1 bg-linear-to-l from-transparent via-border to-primary/50" />
        </div>
    </div>
</template>