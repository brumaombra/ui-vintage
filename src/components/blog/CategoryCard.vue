<script setup lang="ts">
import { NuxtImg } from '#components';
import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card } from '../ui/card';

// Props
const props = withDefaults(defineProps<{
    name: string;
    image?: string;
    count: number;
}>(), {
    image: ''
});
</script>

<template>
    <Card interactive class="group/category h-full gap-0! overflow-hidden p-0! sm:gap-0!">
        <div class="relative h-40 w-full overflow-hidden bg-surface">
            <!-- Background image -->
            <NuxtImg v-if="props.image" :src="props.image" :alt="props.name" height="225" width="400" format="avif" quality="35" :sizes="{ 480: '480px', 1280: '400px' }" loading="lazy" decoding="async" class="size-full object-cover transition-[scale] duration-700 ease-out-expo group-hover/category:scale-110" />

            <!-- Fallback when there is no image -->
            <div v-else aria-hidden="true" class="size-full bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--primary)_35%,transparent),transparent_65%)]" />

            <!-- Legibility shade -->
            <div aria-hidden="true" class="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/0" />

            <!-- Arrow that appears on hover -->
            <span aria-hidden="true" class="absolute top-3 right-3 flex size-8 scale-75 items-center justify-center rounded border border-white/25 bg-black/30 text-white opacity-0 backdrop-blur-md transition-[opacity,scale] duration-300 ease-spring group-hover/category:scale-100 group-hover/category:opacity-100">
                <HugeiconsIcon :icon="ArrowUpRight01Icon" class="size-4" />
            </span>

            <!-- Name and count -->
            <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                <span class="truncate text-base font-bold text-white transition-[translate] duration-300 ease-spring group-hover/category:-translate-y-0.5">
                    {{ props.name }}
                </span>
                <span class="shrink-0 rounded-sm border border-white/25 bg-white/15 px-2 py-0.5 text-xs font-bold text-white tabular-nums backdrop-blur-md">
                    {{ props.count }}
                </span>
            </div>
        </div>
    </Card>
</template>