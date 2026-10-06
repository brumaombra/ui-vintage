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
    <header class="relative flex flex-col gap-5 border-b border-border pt-4 pb-8 md:gap-6 md:pt-10 md:pb-10">
        <!-- Primary segment at the start of the rule (grows in after the title) -->
        <span aria-hidden="true" class="absolute -bottom-px left-0 h-0.5 w-20 origin-left animate-uv-grow-x bg-primary" :style="{ animationDelay: descriptionDelay }" />

        <!-- Badges -->
        <div v-if="props.badges.length > 0" class="flex flex-wrap gap-2">
            <Badge v-for="(badge, index) in props.badges"
                :key="`${badge.color}-${badge.text}`"
                :color="badge.color"
                :text="badge.text"
                :pulse="index === 0"
                class="animate-uv-fade-up"
                :style="{ animationDelay: `${index * 70}ms` }" />
        </div>

        <!-- Title (each word rises in with a spring) -->
        <h1 class="text-3xl leading-[1.05] font-semibold tracking-tight text-foreground md:text-6xl">
            <template v-for="(word, index) in titleWords" :key="`${word}-${index}`">
                <span class="inline-block animate-uv-word-in" :style="{ animationDelay: `${120 + Math.min(index, 12) * 55}ms` }">{{ word }}</span>{{ index < titleWords.length - 1 ? ' ' : '' }}
            </template>
        </h1>

        <!-- Description -->
        <p class="max-w-3xl animate-uv-fade-up text-sm leading-relaxed text-muted-foreground md:text-lg" :style="{ animationDelay: descriptionDelay }">
            {{ props.description }}
        </p>
    </header>
</template>
