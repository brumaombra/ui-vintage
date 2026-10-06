<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Calendar03Icon, Clock01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { BlogContentRenderer, BlogFAQSection, BlogInfoSection, BlogSectionTitle, CategoryCard, PostCard, SocialShareSidebar, TableOfContents } from '@brumaombra/ui-vintage/blog';
import { Badge } from '@brumaombra/ui-vintage/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@brumaombra/ui-vintage/breadcrumb';
import { createSEOMetatags, createPageSchema, slugify } from '~/composables/useUtils.js';
import ProseHr from '~/components/content/ProseHr.vue';
import ViewAllLink from '~/components/blog/ViewAllLink.vue';

const { t, locale } = useI18n();
const localeHead = useLocaleHead();
const localePath = useLocalePath();
const route = useRoute();
const { slug } = route.params;
const fullURL = `https://ui-vintage-demo.local${route.path}`;

// Create a deterministic hash for stable related content ordering
const hashString = value => {
    return value.split('').reduce((hash, char) => {
        return ((hash << 5) - hash) + char.charCodeAt(0);
    }, 0);
};

// Sort a list by a deterministic score derived from the current slug
const sortByStableSeed = (items, getKey) => {
    const seed = `${locale.value}-${slug}`;

    // Sort items by their hash score based on the seed and key
    return [...items].sort((itemA, itemB) => {
        const scoreA = hashString(`${seed}-${getKey(itemA)}`);
        const scoreB = hashString(`${seed}-${getKey(itemB)}`);
        return scoreA - scoreB;
    });
};

// Fetch single post
const { data: post } = await useAsyncData(`post-${slug}-${locale.value}`, async () => {
    return await queryCollection('blog').path(route.path).first();
});

// Fetch related posts
const { data: relatedPosts } = await useAsyncData(`related-posts-${slug}-${locale.value}`, async () => {
    // Get all posts except current post
    const posts = await queryCollection('blog').select('title', 'description', 'image', 'categoryText', 'path').where('language', '=', locale.value).where('path', '<>', route.path).all();
    if (!posts || posts.length === 0) return [];

    // Sort posts deterministically based on current slug/locale
    const sortedPosts = sortByStableSeed(posts, postItem => postItem.path || postItem.title);

    // Return first 4 items
    return sortedPosts.slice(0, 4);
});

// Fetch related categories
const { data: relatedCategories } = await useAsyncData(`related-categories-${slug}-${locale.value}`, async () => {
    // Get all posts excluding current post's category
    const allPosts = await queryCollection('blog').select('categorySlug', 'categoryText', 'image').where('language', '=', locale.value).where('categorySlug', '<>', post.value?.categorySlug).all();
    if (!allPosts || allPosts.length === 0) return [];

    // Extract unique categories
    const categoriesList = allPosts.map(post => post.categorySlug);
    const uniqueCategories = categoriesList.filter((category, index, self) => category && self.indexOf(category) === index);
    const categoryCounts = uniqueCategories.map(category => {
        const firstPost = allPosts.find(post => post.categorySlug === category);
        return {
            name: firstPost?.categoryText || category,
            slug: category,
            count: categoriesList.filter(item => item === category).length,
            image: firstPost?.image
        };
    });

    // Sort categories by a deterministic score based on the current slug
    const sortedCategories = sortByStableSeed(categoryCounts, category => category.slug || category.name);

    // Return first 4 categories
    return sortedCategories.slice(0, 4);
});

// Split the title so each word can rise into place on its own
const titleWords = computed(() => (post.value?.title || '').split(/\s+/).filter(Boolean));

// Long publication date in the current locale
const formattedDate = computed(() => post.value?.datePublished
    ? new Intl.DateTimeFormat(locale.value, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(post.value.datePublished))
    : '');

// Estimate the reading time from the words in the rendered body (about 220 words per minute)
const readingMinutes = computed(() => {
    const collectText = node => {
        if (typeof node === 'string') return node;
        if (Array.isArray(node)) return node.map(collectText).join(' ');
        if (node && typeof node === 'object') return Object.values(node).map(collectText).join(' ');
        return '';
    };
    const words = collectText(post.value?.body).split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
});

// Map current post tags to badge data
const postTags = computed(() => (post.value?.tags || [])
    .map(tag => ({
        name: tag,
        slug: slugify(tag)
    }))
    .filter(tag => tag.slug));

// Define SEO metadata
useSeoMeta(createSEOMetatags({
    title: post.value?.title,
    description: post.value?.description,
    url: route.path,
    image: post.value?.image,
    type: 'article'
}));

// Define head metadata
useHead({
    htmlAttrs: {
        lang: localeHead.value.htmlAttrs.lang,
        dir: localeHead.value.htmlAttrs.dir
    },
    link: [...(localeHead.value.link || [])],
    ...createPageSchema({
        title: post.value?.title,
        description: post.value?.description,
        url: route.path,
        isBlogPost: true,
        image: post.value?.image,
        tags: post.value?.tags,
        datePublished: post.value?.datePublished,
        dateModified: post.value?.dateModified,
        author: post.value?.author,
        authorUrl: post.value?.authorUrl,
        authorImageUrl: post.value?.authorImageUrl,
        faqs: post.value?.faqs,
        breadcrumbs: [
            { name: t('seo.home.breadcrumb'), item: localePath('/') },
            { name: t('seo.blog.breadcrumb'), item: localePath('/blog') },
            { name: post.value?.title, item: route.path }
        ]
    })
});

// Define page metadata
definePageMeta({
    layout: 'landing'
});
</script>

<template>
    <div class="mx-auto max-w-4xl">
        <article v-if="post">
            <!-- Article header -->
            <header class="relative isolate mb-10 md:mb-14">
                <!-- Breadcrumbs -->
                <Breadcrumb class="animate-uv-fade-up">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink as-child>
                                <NuxtLinkLocale to="/blog">
                                    {{ t('navigation.breadcrumbs.blog') }}
                                </NuxtLinkLocale>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem v-if="post.categoryText">
                            <BreadcrumbLink as-child>
                                <NuxtLinkLocale :to="`/blog/categories/${post.categorySlug}`">
                                    {{ post.categoryText }}
                                </NuxtLinkLocale>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator v-if="post.categoryText" />
                        <BreadcrumbItem class="min-w-0">
                            <BreadcrumbPage class="truncate">
                                {{ post?.title }}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <!-- Category and tags -->
                <div class="mt-8 flex flex-wrap items-center gap-2 animate-uv-fade-up [animation-delay:60ms]">
                    <NuxtLinkLocale v-if="post.categoryText" :to="`/blog/categories/${post.categorySlug}`" class="rounded outline-none transition-opacity duration-150 hover:opacity-80 focus-visible:ring-[3px] focus-visible:ring-ring/45">
                        <Badge color="yellow" :text="post.categoryText" pulse />
                    </NuxtLinkLocale>
                    <NuxtLinkLocale v-for="tag in postTags" :key="tag.slug" :to="`/blog/tags/${tag.slug}`" class="rounded outline-none transition-opacity duration-150 hover:opacity-80 focus-visible:ring-[3px] focus-visible:ring-ring/45">
                        <Badge :text="`#${tag.name}`" />
                    </NuxtLinkLocale>
                </div>

                <!-- Title (each word rises in) -->
                <h1 class="mt-5 text-3xl leading-[1.08] font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                    <template v-for="(word, index) in titleWords" :key="`${word}-${index}`">
                        <span class="inline-block animate-uv-word-in" :style="{ animationDelay: `${120 + Math.min(index, 12) * 50}ms` }">{{ word }}</span>{{ index < titleWords.length - 1 ? ' ' : '' }}
                    </template>
                </h1>

                <!-- Lede -->
                <p v-if="post.description" class="mt-5 max-w-3xl animate-uv-fade-up text-sm leading-relaxed text-muted-foreground [animation-delay:450ms] md:text-lg">
                    {{ post.description }}
                </p>

                <!-- Author, date, and reading time -->
                <div class="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 animate-uv-fade-up text-xs text-muted-foreground [animation-delay:550ms] sm:text-sm">
                    <span class="flex items-center gap-2.5">
                        <NuxtImg :src="post.authorImageUrl" :alt="post.author" width="32" height="32" format="avif" quality="40" class="size-8 rounded border border-border object-cover" />
                        <span class="font-semibold text-foreground">{{ post.author }}</span>
                    </span>
                    <span aria-hidden="true" class="size-1 rounded-full bg-border-strong" />
                    <span class="flex items-center gap-1.5">
                        <HugeiconsIcon :icon="Calendar03Icon" class="size-4 text-primary" />
                        <time :datetime="post.datePublished">{{ formattedDate }}</time>
                    </span>
                    <span aria-hidden="true" class="size-1 rounded-full bg-border-strong" />
                    <span class="flex items-center gap-1.5">
                        <HugeiconsIcon :icon="Clock01Icon" class="size-4 text-primary" />
                        {{ t('blog.minRead', { minutes: readingMinutes }) }}
                    </span>
                </div>

                <!-- Featured image -->
                <div v-if="post.image" class="relative mt-10 aspect-video w-full overflow-hidden rounded border border-border shadow-elevated-xl animate-uv-fade-up [animation-delay:650ms]">
                    <NuxtImg :src="post.image" :alt="post.title" format="avif" quality="50" :sizes="{ 480: '480px', 1536: '896px' }" loading="eager" fetchpriority="high" preload class="size-full animate-uv-ken-burns object-cover" />
                    <div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                </div>
            </header>

            <!-- Table of contents -->
            <TableOfContents :content="post" />

            <!-- Social share sidebar -->
            <SocialShareSidebar :title="post.title" :url="fullURL" />

            <!-- Article content -->
            <BlogContentRenderer :value="post" />

            <!-- Divider -->
            <ProseHr />

            <!-- FAQ section -->
            <BlogFAQSection v-if="post.faqs && post.faqs?.length > 0" :faqs="post.faqs" />

            <!-- Divider -->
            <ProseHr />

            <!-- Blog info section -->
            <BlogInfoSection :author="post.author"
                :author-url="post.authorUrl"
                :author-image-url="post.authorImageUrl"
                :date-published="post.datePublished"
                :date-modified="post.dateModified" />
        </article>

        <!-- Related posts -->
        <section v-if="relatedPosts?.length" class="mt-16 md:mt-24">
            <BlogSectionTitle :title="t('blog.readAlso')" />
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <NuxtLinkLocale v-for="(relatedPost, index) in relatedPosts" :key="relatedPost.path" :to="relatedPost.path" data-aos="blur-up" :data-aos-delay="(index % 2) * 90" class="block h-full rounded outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45">
                    <PostCard :image="relatedPost.image"
                        :category="relatedPost.categoryText"
                        :title="relatedPost.title"
                        :description="relatedPost.description"
                        class="h-full" />
                </NuxtLinkLocale>
            </div>
        </section>

        <!-- Related categories -->
        <section v-if="relatedCategories?.length" class="mt-16 md:mt-24">
            <BlogSectionTitle :title="t('blog.exploreCategories')">
                <template #action>
                    <ViewAllLink :to="localePath('/blog/categories')" :label="t('blog.exploreAllCategories')" />
                </template>
            </BlogSectionTitle>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <NuxtLinkLocale v-for="(category, index) in relatedCategories" :key="category.slug" :to="`/blog/categories/${category.slug}`" data-aos="blur-up" :data-aos-delay="(index % 2) * 90" class="block h-full rounded outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45">
                    <CategoryCard :name="category.name"
                        :image="category.image"
                        :count="category.count" />
                </NuxtLinkLocale>
            </div>
        </section>
    </div>
</template>