<script setup lang="ts">
import { NuxtImg } from '#components';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
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

// Whether the category link can be built
const hasCategory = computed(() => Boolean(props.categoryText && props.categorySlug));

// Whether the details row has any column to show
const hasDetails = computed(() => Boolean(props.author || formattedDate.value || resolvedReadingMinutes.value || hasCategory.value));

const badgeLinkClasses = 'rounded outline-none transition-opacity duration-150 hover:opacity-80 focus-visible:ring-[3px] focus-visible:ring-ring/45';

// Shared classes for the details cells (exposed to the meta slot)
const detailCellClasses = 'min-w-0 border-t border-l border-border py-4 pl-4 pr-4';
const detailLabelClasses = 'text-[11px] font-semibold tracking-wider text-muted-foreground uppercase';
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
                <template v-if="hasCategory">
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

        <!-- Title and lede, closed by a rule with a primary segment -->
        <div class="relative mt-8 border-b border-border pb-8">
            <span aria-hidden="true" :class="['absolute -bottom-px left-0 h-0.5 w-20 origin-left bg-primary', enter('animate-uv-grow-x')]" :style="props.animated ? { animationDelay: '500ms' } : undefined" />

            <!-- Title (each word rises in) -->
            <h1 class="text-3xl leading-[1.08] font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                <template v-for="(word, index) in titleWords" :key="`${word}-${index}`">
                    <span :class="['inline-block', enter('animate-uv-word-in')]" :style="props.animated ? { animationDelay: `${120 + Math.min(index, 12) * 50}ms` } : undefined">{{ word }}</span>{{ index < titleWords.length - 1 ? ' ' : '' }}
                </template>
            </h1>

            <!-- Lede -->
            <p v-if="props.description" :class="['mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-lg', enter('animate-uv-fade-up [animation-delay:450ms]')]">
                {{ props.description }}
            </p>
        </div>

        <!-- Labelled details (columns without data are left out; the meta slot adds more) -->
        <div v-if="hasDetails || $slots.meta" :class="['overflow-hidden border-b border-border', enter('animate-uv-fade-up [animation-delay:550ms]')]">
            <dl class="-mt-px -ml-[calc(1rem+1px)] grid grid-cols-2 md:grid-flow-col md:auto-cols-fr md:grid-cols-none">
                <!-- Author -->
                <div v-if="props.author" :class="detailCellClasses">
                    <dt :class="detailLabelClasses">{{ t('uiVintage.blog.author') }}</dt>
                    <dd class="mt-2 flex min-w-0 items-center gap-2 text-sm font-semibold text-foreground">
                        <NuxtImg v-if="props.authorImageUrl" :src="props.authorImageUrl" :alt="props.author" width="24" height="24" format="avif" quality="40" class="size-6 shrink-0 rounded border border-border object-cover" />
                        <span class="truncate">{{ props.author }}</span>
                    </dd>
                </div>

                <!-- Publication date -->
                <div v-if="formattedDate" :class="detailCellClasses">
                    <dt :class="detailLabelClasses">{{ t('uiVintage.blog.publishedDate') }}</dt>
                    <dd class="mt-2 text-sm text-foreground">
                        <time :datetime="props.datePublished">{{ formattedDate }}</time>
                    </dd>
                </div>

                <!-- Reading time -->
                <div v-if="resolvedReadingMinutes" :class="detailCellClasses">
                    <dt :class="detailLabelClasses">{{ t('uiVintage.blog.readingTime') }}</dt>
                    <dd class="mt-2 text-sm text-foreground">{{ t('uiVintage.blog.readingTimeValue', { minutes: resolvedReadingMinutes }) }}</dd>
                </div>

                <!-- Category -->
                <div v-if="hasCategory" :class="detailCellClasses">
                    <dt :class="detailLabelClasses">{{ t('uiVintage.blog.category') }}</dt>
                    <dd class="mt-1.5">
                        <NuxtLinkLocale :to="categoryPath" :class="['inline-flex', badgeLinkClasses]">
                            <Badge color="yellow" :text="props.categoryText" pulse />
                        </NuxtLinkLocale>
                    </dd>
                </div>

                <!-- Extra columns from the app (use the same cell structure: a div with a dt and a dd) -->
                <slot name="meta" :cell-classes="detailCellClasses" :label-classes="detailLabelClasses" />
            </dl>
        </div>

        <!-- Tags -->
        <div v-if="props.tags.length > 0" :class="['mt-4 flex flex-wrap items-center gap-2', enter('animate-uv-fade-up [animation-delay:600ms]')]">
            <NuxtLinkLocale v-for="tag in props.tags" :key="tag.slug" :to="tagPath(tag.slug)" :class="badgeLinkClasses">
                <Badge :text="`#${tag.name}`" />
            </NuxtLinkLocale>
        </div>

        <!-- Featured image (replaceable through the media slot) -->
        <slot name="media">
            <div v-if="props.image" :class="['relative mt-8 aspect-video w-full overflow-hidden rounded border border-border shadow-elevated-xl', enter('animate-uv-fade-up [animation-delay:650ms]')]">
                <NuxtImg :src="props.image" :alt="props.title" format="avif" quality="50" :sizes="{ 480: '480px', 1536: '896px' }" loading="eager" fetchpriority="high" preload :class="['size-full object-cover', enter('animate-uv-ken-burns')]" />
                <div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            </div>
        </slot>
    </header>
</template>
