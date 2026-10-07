<script setup lang="ts">
import { NuxtImg } from '#components';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Calendar03Icon, Clock01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Badge } from '../ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import { formatDateLongItalyTimezone, getReadingMinutes } from '../../lib/utils';

// Props
const props = withDefaults(defineProps<{
    title: string;
    description?: string;
    image?: string;
    author?: string;
    authorImageUrl?: string;
    datePublished?: string;
    categoryText?: string;
    categorySlug?: string;
    tags?: Array<{
        name: string;
        slug: string;
    }>;
    body?: unknown;
    readingMinutes?: number | null;
    blogPath?: string;
    blogLabel?: string;
    animated?: boolean;
}>(), {
    description: '',
    image: '',
    author: '',
    authorImageUrl: '',
    datePublished: '',
    categoryText: '',
    categorySlug: '',
    tags: () => [],
    readingMinutes: null,
    blogPath: '/blog',
    blogLabel: '',
    animated: true
});

const { t, locale } = useI18n();

// Split the title so each word can rise into place on its own
const titleWords = computed(() => props.title.split(/\s+/).filter(Boolean));

// Long publication date in the current locale
const formattedDate = computed(() => formatDateLongItalyTimezone(props.datePublished, locale.value));

// Explicit reading time wins, otherwise estimate it from the body
const resolvedReadingMinutes = computed(() => {
    if (props.readingMinutes) return props.readingMinutes;
    return props.body ? getReadingMinutes(props.body) : null;
});

// Links built from the blog base path
const categoryPath = computed(() => `${props.blogPath}/categories/${props.categorySlug}`);
const tagPath = (slug: string) => `${props.blogPath}/tags/${slug}`;

// Keep only the entrance classes when animations are enabled
const enter = (classes: string) => props.animated ? classes : '';

// Whether the author, date, and reading time line has anything to show
const hasMeta = computed(() => Boolean(props.author || formattedDate.value || resolvedReadingMinutes.value));

const badgeLinkClasses = 'rounded outline-none transition-opacity duration-150 hover:opacity-80 focus-visible:ring-[3px] focus-visible:ring-ring/45';
</script>

<template>
    <header class="relative isolate mb-10 md:mb-14">
        <!-- Breadcrumbs -->
        <Breadcrumb :class="enter('animate-uv-fade-up')">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink as-child>
                        <NuxtLinkLocale :to="props.blogPath">
                            {{ props.blogLabel || t('uiVintage.blog.breadcrumbBlog') }}
                        </NuxtLinkLocale>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <template v-if="props.categoryText && props.categorySlug">
                    <BreadcrumbItem>
                        <BreadcrumbLink as-child>
                            <NuxtLinkLocale :to="categoryPath">
                                {{ props.categoryText }}
                            </NuxtLinkLocale>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                </template>
                <BreadcrumbItem class="min-w-0">
                    <BreadcrumbPage class="truncate">
                        {{ props.title }}
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        <!-- Category and tags -->
        <div v-if="(props.categoryText && props.categorySlug) || props.tags.length > 0" :class="['mt-8 flex flex-wrap items-center gap-2', enter('animate-uv-fade-up [animation-delay:60ms]')]">
            <NuxtLinkLocale v-if="props.categoryText && props.categorySlug" :to="categoryPath" :class="badgeLinkClasses">
                <Badge color="yellow" :text="props.categoryText" pulse />
            </NuxtLinkLocale>
            <NuxtLinkLocale v-for="tag in props.tags" :key="tag.slug" :to="tagPath(tag.slug)" :class="badgeLinkClasses">
                <Badge :text="`#${tag.name}`" />
            </NuxtLinkLocale>
        </div>

        <!-- Title (each word rises in) -->
        <h1 class="mt-5 text-3xl leading-[1.08] font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            <template v-for="(word, index) in titleWords" :key="`${word}-${index}`">
                <span :class="['inline-block', enter('animate-uv-word-in')]" :style="props.animated ? { animationDelay: `${120 + Math.min(index, 12) * 50}ms` } : undefined">{{ word }}</span>{{ index < titleWords.length - 1 ? ' ' : '' }}
            </template>
        </h1>

        <!-- Lede -->
        <p v-if="props.description" :class="['mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-lg', enter('animate-uv-fade-up [animation-delay:450ms]')]">
            {{ props.description }}
        </p>

        <!-- Author, date, and reading time -->
        <div v-if="hasMeta || $slots.meta" :class="['mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground sm:text-sm', enter('animate-uv-fade-up [animation-delay:550ms]')]">
            <span v-if="props.author" class="flex items-center gap-2.5">
                <NuxtImg v-if="props.authorImageUrl" :src="props.authorImageUrl" :alt="props.author" width="32" height="32" format="avif" quality="40" class="size-8 rounded border border-border object-cover" />
                <span class="font-semibold text-foreground">{{ props.author }}</span>
            </span>
            <span v-if="props.author && formattedDate" aria-hidden="true" class="size-1 rounded-full bg-border-strong" />
            <span v-if="formattedDate" class="flex items-center gap-1.5">
                <HugeiconsIcon :icon="Calendar03Icon" class="size-4 text-primary" />
                <time :datetime="props.datePublished">{{ formattedDate }}</time>
            </span>
            <span v-if="(props.author || formattedDate) && resolvedReadingMinutes" aria-hidden="true" class="size-1 rounded-full bg-border-strong" />
            <span v-if="resolvedReadingMinutes" class="flex items-center gap-1.5">
                <HugeiconsIcon :icon="Clock01Icon" class="size-4 text-primary" />
                {{ t('uiVintage.blog.minRead', { minutes: resolvedReadingMinutes }) }}
            </span>

            <!-- Extra metadata from the app -->
            <slot name="meta" />
        </div>

        <!-- Featured image (replaceable through the media slot) -->
        <slot name="media">
            <div v-if="props.image" :class="['relative mt-10 aspect-video w-full overflow-hidden rounded border border-border shadow-elevated-xl', enter('animate-uv-fade-up [animation-delay:650ms]')]">
                <NuxtImg :src="props.image" :alt="props.title" format="avif" quality="50" :sizes="{ 480: '480px', 1536: '896px' }" loading="eager" fetchpriority="high" preload :class="['size-full object-cover', enter('animate-uv-ken-burns')]" />
                <div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            </div>
        </slot>
    </header>
</template>
