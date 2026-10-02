<script setup lang="ts">
import { computed } from 'vue';
import type { ToneColor } from '../../lib/color-tokens';
import { Badge } from '../ui/badge';

// Props
const props = withDefaults(defineProps<{
    badges?: Array<{
        color: ToneColor;
        text: string;
    }>;
    title: string;
    description: string;
}>(), {
    badges: () => []
});

// Split the title so each word can rise into place on its own
const titleWords = computed(() => props.title.split(/\s+/).filter(Boolean));

// The description follows the last word of the title
const descriptionDelay = computed(() => `${Math.min(titleWords.value.length, 12) * 55 + 200}ms`);
</script>

<template>
    <header class="relative isolate flex flex-col gap-6 pt-4 pb-2 md:gap-8 md:pt-10">
        <!-- Ambient glow -->
        <div aria-hidden="true" class="pointer-events-none absolute -top-24 -left-24 -z-10 h-80 w-[36rem] max-w-[120%] rounded-full bg-primary/12 blur-[100px]" />

        <!-- Badges -->
        <div v-if="props.badges.length > 0" class="flex flex-wrap gap-3">
            <Badge v-for="(badge, index) in props.badges"
                :key="`${badge.color}-${badge.text}`"
                :color="badge.color"
                :text="badge.text"
                :pulse="index === 0"
                class="animate-uv-fade-up"
                :style="{ animationDelay: `${index * 70}ms` }" />
        </div>

        <!-- Title (each word rises in with a spring) -->
        <h1 class="text-3xl leading-[1.05] font-bold tracking-tight text-foreground md:text-6xl">
            <template v-for="(word, index) in titleWords" :key="`${word}-${index}`">
                <span class="inline-block animate-uv-word-in" :style="{ animationDelay: `${120 + Math.min(index, 12) * 55}ms` }">{{ word }}</span>{{ index < titleWords.length - 1 ? ' ' : '' }}
            </template>
        </h1>

        <!-- Accent rule -->
        <div aria-hidden="true" class="h-1 w-20 origin-left animate-uv-grow-x rounded-full bg-primary shadow-glow" :style="{ animationDelay: descriptionDelay }" />

        <!-- Description -->
        <p class="max-w-3xl animate-uv-fade-up text-sm leading-relaxed text-muted-foreground md:text-xl" :style="{ animationDelay: descriptionDelay }">
            {{ props.description }}
        </p>
    </header>
</template>