<script setup lang="ts">
import { NuxtImg } from '#components';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowUpRight01Icon, Calendar03Icon, RefreshIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card } from '../ui/card';
import { formatDateLongItalyTimezone } from '../../lib/utils';

// Props
const props = withDefaults(defineProps<{
    author: string;
    authorUrl: string;
    authorImageUrl: string;
    authorBio?: string;
    datePublished: string;
    dateModified?: string | null;
}>(), {
    authorBio: '',
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
    <Card data-aos="blur-up" class="gap-0! overflow-hidden p-0!">
        <!-- Author -->
        <div :class="['flex gap-3 px-5 py-4', props.authorBio ? 'items-start' : 'items-center']">
            <!-- Author image -->
            <NuxtLink :to="props.authorUrl" target="_blank" rel="noopener noreferrer" class="shrink-0 rounded outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45">
                <NuxtImg :src="props.authorImageUrl" :alt="props.author" height="44" width="44" format="avif" quality="40" :sizes="{ 480: '44px', 1280: '44px' }" loading="lazy" decoding="async" class="size-11 rounded border border-border object-cover" />
            </NuxtLink>

            <!-- Author name and bio -->
            <div class="min-w-0 flex-1">
                <p class="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{{ t('uiVintage.blog.author') }}</p>
                <NuxtLink :to="props.authorUrl" target="_blank" rel="noopener noreferrer" class="group/link inline-flex items-center gap-1 text-sm font-semibold text-foreground outline-none transition-colors hover:text-primary focus-visible:underline md:text-base">
                    {{ props.author }}
                    <HugeiconsIcon :icon="ArrowUpRight01Icon" class="size-4 text-muted-foreground transition-[translate,color] duration-300 ease-spring group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-primary" />
                </NuxtLink>
                <p v-if="props.authorBio" class="mt-1.5 text-xs leading-relaxed text-muted-foreground md:text-sm">
                    {{ props.authorBio }}
                </p>
            </div>
        </div>

        <!-- Date information -->
        <div v-if="props.datePublished || showModifiedDate" class="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border bg-surface px-5 py-2.5 text-xs text-muted-foreground">
            <!-- Published date -->
            <span v-if="props.datePublished" class="inline-flex items-center gap-2">
                <HugeiconsIcon :icon="Calendar03Icon" class="size-3.5 shrink-0 text-primary" />
                {{ t('uiVintage.blog.publishedDate') }}
                <time :datetime="props.datePublished" class="text-foreground">{{ formattedPublishedDate }}</time>
            </span>

            <!-- Divider between the dates (hidden when they wrap on small screens) -->
            <span v-if="props.datePublished && showModifiedDate" aria-hidden="true" class="hidden h-3.5 w-px bg-border sm:block" />

            <!-- Last updated date -->
            <span v-if="showModifiedDate" class="inline-flex items-center gap-2">
                <HugeiconsIcon :icon="RefreshIcon" class="size-3.5 shrink-0 text-primary" />
                {{ t('uiVintage.blog.lastUpdatedDate') }}
                <time :datetime="props.dateModified ?? undefined" class="text-foreground">{{ formattedModifiedDate }}</time>
            </span>
        </div>
    </Card>
</template>
