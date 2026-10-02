<script setup lang="ts">
import { NuxtImg } from '#components';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowUpRight01Icon, Calendar03Icon, RefreshIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card, CardContent } from '../ui/card';
import { formatDateLongItalyTimezone } from '../../lib/utils';

// Props
const props = withDefaults(defineProps<{
    author: string;
    authorUrl: string;
    authorImageUrl: string;
    datePublished: string;
    dateModified?: string | null;
}>(), {
    dateModified: null
});

const { t, locale } = useI18n();

// Formatted dates
const formattedPublishedDate = computed(() => formatDateLongItalyTimezone(props.datePublished, locale.value));
const formattedModifiedDate = computed(() => formatDateLongItalyTimezone(props.dateModified, locale.value));

// Only show the update date when it differs from the publication date
const showModifiedDate = computed(() => Boolean(props.dateModified) && formattedModifiedDate.value !== formattedPublishedDate.value);
</script>

<template>
    <!-- Author and date information -->
    <Card data-aos="blur-up" class="group/author relative overflow-hidden">
        <!-- Accent glow -->
        <div aria-hidden="true" class="pointer-events-none absolute -top-16 -left-16 size-48 rounded-full bg-primary/10 blur-3xl" />

        <CardContent class="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <!-- Author -->
            <div class="flex items-center gap-4">
                <!-- Author image -->
                <NuxtLink :to="props.authorUrl" target="_blank" rel="noopener noreferrer" class="relative shrink-0 rounded outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45">
                    <NuxtImg :src="props.authorImageUrl" :alt="props.author" height="56" width="56" format="avif" quality="40" :sizes="{ 480: '56px', 1280: '56px' }" loading="lazy" decoding="async" class="size-14 rounded border border-border object-cover shadow-elevated-sm transition-[scale] duration-300 ease-spring hover:scale-105" />
                </NuxtLink>

                <!-- Author name -->
                <div class="min-w-0">
                    <p class="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">{{ t('uiVintage.blog.author') }}</p>
                    <NuxtLink :to="props.authorUrl" target="_blank" rel="noopener noreferrer" class="group/link mt-0.5 inline-flex items-center gap-1 text-base font-bold text-foreground outline-none hover:text-primary focus-visible:underline">
                        {{ props.author }}
                        <HugeiconsIcon :icon="ArrowUpRight01Icon" class="size-4 transition-[translate] duration-300 ease-spring group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </NuxtLink>
                </div>
            </div>

            <!-- Date information -->
            <div class="flex flex-wrap gap-2 sm:justify-end">
                <!-- Published date -->
                <div v-if="props.datePublished" class="flex items-center gap-2 rounded border border-border bg-surface px-3 py-2 text-xs text-muted-foreground">
                    <HugeiconsIcon :icon="Calendar03Icon" class="size-4 shrink-0 text-primary" />
                    <span class="font-semibold">{{ t('uiVintage.blog.publishedDate') }}</span>
                    <time :datetime="props.datePublished" class="text-foreground">{{ formattedPublishedDate }}</time>
                </div>

                <!-- Last updated date -->
                <div v-if="showModifiedDate" class="flex items-center gap-2 rounded border border-border bg-surface px-3 py-2 text-xs text-muted-foreground">
                    <HugeiconsIcon :icon="RefreshIcon" class="size-4 shrink-0 text-primary" />
                    <span class="font-semibold">{{ t('uiVintage.blog.lastUpdatedDate') }}</span>
                    <time :datetime="props.dateModified ?? undefined" class="text-foreground">{{ formattedModifiedDate }}</time>
                </div>
            </div>
        </CardContent>
    </Card>
</template>