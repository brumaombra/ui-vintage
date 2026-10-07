<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import type { HugeiconsIconDefinition } from '../../lib/common-types';
import type { ToneColor } from '../../lib/color-tokens';
import { Badge } from '../ui/badge';
import { StatStrip } from '../stat-strip';

// Props
const props = withDefaults(defineProps<{
    badges?: Array<{
        color: ToneColor;
        text: string;
    }>;
    announcement?: {
        text: string;
        to: string;
        label?: string;
    } | null;
    title: string;
    highlight?: string;
    description: string;
    stats?: Array<{
        label: string;
        value: string | number;
        icon?: HugeiconsIconDefinition;
    }>;
}>(), {
    badges: () => [],
    announcement: null,
    highlight: '',
    stats: () => []
});

const { t } = useI18n();

// Split the title around the highlighted part (when it appears in the title)
const titleParts = computed(() => {
    const index = props.highlight ? props.title.indexOf(props.highlight) : -1;
    if (index === -1) return { before: props.title, highlight: '', after: '' };
    return {
        before: props.title.slice(0, index),
        highlight: props.highlight,
        after: props.title.slice(index + props.highlight.length)
    };
});

// Words that rise in one by one (the highlight rises in as a single block between them)
const splitWords = (text: string) => text.split(/\s+/).filter(Boolean);
const beforeWords = computed(() => splitWords(titleParts.value.before));
const afterWords = computed(() => splitWords(titleParts.value.after));
const wordDelay = (index: number) => `${120 + Math.min(index, 12) * 55}ms`;
const highlightDelay = computed(() => wordDelay(beforeWords.value.length));
const afterDelay = (index: number) => wordDelay(beforeWords.value.length + 1 + index);

// The rest of the header follows the last word of the title
const titleLength = computed(() => beforeWords.value.length + afterWords.value.length + (titleParts.value.highlight ? 1 : 0));
const descriptionDelay = computed(() => `${Math.min(titleLength.value, 12) * 55 + 200}ms`);
const statsDelay = computed(() => `${Math.min(titleLength.value, 12) * 55 + 300}ms`);
const underlineDelay = computed(() => `${beforeWords.value.length * 55 + 600}ms`);
</script>

<template>
    <header class="relative flex flex-col items-center gap-6 pt-6 pb-4 text-center md:pt-12 md:pb-6">
        <!-- Announcement (links to something new, such as the latest post) -->
        <NuxtLink v-if="props.announcement" :to="props.announcement.to" class="group/announce max-w-full animate-uv-fade-up rounded outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45">
            <span class="inline-flex max-w-full items-center gap-2 rounded border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs text-yellow-800 transition-colors duration-150 group-hover/announce:border-yellow-300 dark:border-yellow-700/40 dark:bg-yellow-500/10 dark:text-yellow-300 dark:group-hover/announce:border-yellow-700/70">
                <span aria-hidden="true" class="relative flex size-1.5 shrink-0">
                    <span class="absolute inline-flex size-full animate-uv-ping-soft rounded-full bg-current opacity-60" />
                    <span class="relative inline-flex size-1.5 rounded-full bg-current" />
                </span>
                <span class="shrink-0 font-semibold">{{ props.announcement.label || t('uiVintage.blog.new') }}</span>
                <span class="truncate opacity-80">{{ props.announcement.text }}</span>
                <HugeiconsIcon :icon="ArrowRight01Icon" class="size-3.5 shrink-0 transition-transform duration-300 ease-spring group-hover/announce:translate-x-0.5" />
            </span>
        </NuxtLink>

        <!-- Badges -->
        <div v-if="props.badges.length > 0" class="flex flex-wrap justify-center gap-2">
            <Badge v-for="(badge, index) in props.badges"
                :key="`${badge.color}-${badge.text}`"
                :color="badge.color"
                :text="badge.text"
                :pulse="index === 0 && !props.announcement"
                class="animate-uv-fade-up"
                :style="{ animationDelay: `${index * 70}ms` }" />
        </div>

        <!-- Title (each word rises in with a spring, the highlight gets a hand-drawn underline) -->
        <h1 class="max-w-4xl text-4xl leading-[1.05] font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            <template v-for="(word, index) in beforeWords" :key="`before-${word}-${index}`">
                <span class="inline-block animate-uv-word-in" :style="{ animationDelay: wordDelay(index) }">{{ word }}</span>{{ ' ' }}
            </template>
            <span v-if="titleParts.highlight" class="relative inline-block animate-uv-word-in text-primary" :style="{ animationDelay: highlightDelay }">
                {{ titleParts.highlight }}
                <svg class="absolute -bottom-2 left-0 h-3 w-full text-primary/60" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M2 9C40 3 80 2 198 7" stroke="currentColor" stroke-width="4" stroke-linecap="round" pathLength="1" class="animate-uv-draw [stroke-dasharray:1]" :style="{ animationDelay: underlineDelay }" />
                </svg>
            </span>
            <template v-for="(word, index) in afterWords" :key="`after-${word}-${index}`">
                {{ index === 0 && !/^\s/.test(titleParts.after) ? '' : ' ' }}<span class="inline-block animate-uv-word-in" :style="{ animationDelay: afterDelay(index) }">{{ word }}</span>
            </template>
        </h1>

        <!-- Description -->
        <p class="max-w-2xl animate-uv-fade-up text-sm leading-7 text-muted-foreground sm:text-base" :style="{ animationDelay: descriptionDelay }">
            {{ props.description }}
        </p>

        <!-- Stats strip -->
        <StatStrip :items="props.stats" class="animate-uv-fade-up justify-center" :style="{ animationDelay: statsDelay }" />
    </header>
</template>
