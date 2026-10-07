<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { BlogContentRenderer, BlogFAQSection, BlogInfoSection, BlogPostHeader, BlogSectionTitle, CategoryCard, PostCard, SocialShareSidebar, TableOfContents } from '@brumaombra/ui-vintage/blog';
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
            <BlogPostHeader :title="post.title"
                :description="post.description"
                :image="post.image"
                :author="post.author"
                :author-image-url="post.authorImageUrl"
                :date-published="post.datePublished"
                :category-text="post.categoryText"
                :category-slug="post.categorySlug"
                :tags="postTags"
                :body="post.body" />

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