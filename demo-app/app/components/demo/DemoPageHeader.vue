<script setup lang="ts">
import type { DashboardSquare01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';

// Props
const props = withDefaults(defineProps<{
    eyebrow: string;
    title: string;
    description: string;
    icon?: typeof DashboardSquare01Icon | null;
}>(), {
    icon: null
});
</script>

<template>
    <header class="relative flex flex-col gap-4 pb-2 sm:flex-row sm:items-end sm:justify-between">
        <div class="flex min-w-0 items-start gap-4">
            <!-- Page icon tile -->
            <div v-if="props.icon" class="hidden size-14 shrink-0 animate-uv-pop items-center justify-center rounded border border-primary/30 bg-primary/10 text-primary shadow-glow sm:flex">
                <HugeiconsIcon :icon="props.icon" class="size-7" :stroke-width="1.6" />
            </div>

            <div class="min-w-0">
                <!-- Eyebrow -->
                <div class="animate-uv-fade-up text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
                    {{ props.eyebrow }}
                </div>

                <!-- Title -->
                <h1 class="mt-1 animate-uv-fade-up text-2xl font-bold tracking-tight [animation-delay:60ms] sm:text-3xl">
                    {{ props.title }}
                </h1>

                <!-- Description -->
                <p class="mt-2 max-w-2xl animate-uv-fade-up text-xs leading-6 text-muted-foreground [animation-delay:120ms] sm:text-sm">
                    {{ props.description }}
                </p>
            </div>
        </div>

        <!-- Trailing actions -->
        <div v-if="$slots.default" class="animate-uv-fade-up [animation-delay:180ms]">
            <slot />
        </div>
    </header>
</template>