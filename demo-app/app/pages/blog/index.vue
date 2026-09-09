<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { AllPostsSection, BlogHeaderSection, BlogSectionTitle, CategoriesSection, HeaderCarousel } from '@brumaombra/ui-vintage/blog';
import { Badge } from '@brumaombra/ui-vintage/badge';
import { createSEOMetatags, createPageSchema, buildTagsFromPosts } from '~/composables/useUtils.js';

const { t, locale } = useI18n();
const localeHead = useLocaleHead();
const localePath = useLocalePath();
const route = useRoute();
const currentPage = ref(1);
const postsPerPage = 9;
const isLoading = ref(false);

// Map post links to include localized paths
const mapPostLinks = posts => {
    return posts.map(post => ({
        ...post,
        path: localePath(post.path),
        categoryPath: post.categorySlug ? localePath(`/blog/categories/${post.categorySlug}`) : undefined
    }));
};

// Build category cards data from blog posts
const buildCategoriesFromPosts = posts => {
    // Extract unique categories
    const categoriesList = posts.map(post => post.categorySlug);
    const uniqueCategories = categoriesList.filter((category, index, self) => category && self.indexOf(category) === index);

    // Map unique categories to category data
    return uniqueCategories.map(category => {
        const firstPost = posts.find(post => post.categorySlug === category);

        // Return category data
        return {
            name: firstPost?.categoryText || category,
            slug: category,
            path: localePath(`/blog/categories/${category}`),
            count: categoriesList.filter(item => item === category).length,
            image: firstPost?.image
        };
    });
};

// Fetch blog index data
const { data: blogIndexData } = await useAsyncData(`blog-index-${locale.value}`, async () => {
    try {
        // Execute queries in parallel
        const [featuredPosts, initialPosts, totalPosts, categoryPosts, tagPosts] = await Promise.all([
            queryCollection('blog').select('id', 'path', 'image', 'title', 'description', 'categoryText', 'categorySlug').where('language', '=', locale.value).limit(6).all(),
            queryCollection('blog').select('path', 'image', 'title', 'description', 'categoryText', 'categorySlug').where('language', '=', locale.value).order('datePublished', 'DESC').limit(postsPerPage).all(),
            queryCollection('blog').where('language', '=', locale.value).count(),
            queryCollection('blog').select('categorySlug', 'categoryText', 'image').where('language', '=', locale.value).all(),
            queryCollection('blog').select('tags').where('language', '=', locale.value).all()
        ]);

        // Return the data
        return {
            featuredPosts: mapPostLinks(featuredPosts),
            initialPosts: mapPostLinks(initialPosts),
            totalPosts,
            categories: buildCategoriesFromPosts(categoryPosts),
            tags: buildTagsFromPosts(tagPosts)
        };
    } catch (error) {
        console.error('Error loading blog index data:', error);
        return {
            featuredPosts: [],
            initialPosts: [],
            totalPosts: 0,
            categories: [],
            tags: []
        };
    }
});

// Initialize reactive states
const featuredPosts = blogIndexData.value?.featuredPosts || [];
const posts = ref(blogIndexData.value?.initialPosts || []);
const totalPosts = ref(blogIndexData.value?.totalPosts || 0);
const categories = blogIndexData.value?.categories || [];
const tags = blogIndexData.value?.tags || [];
const hasMorePosts = ref(posts.value.length < totalPosts.value);

// List of badges for the header section
const headerBadges = [
    { color: 'blue', text: t('blog.header.badge.topic') },
    { color: 'green', text: t('blog.header.badge.content') },
    { color: 'gray', text: t('blog.header.badge.free') }
];

// Load more posts
const loadMorePosts = async () => {
    isLoading.value = true;

    try {
        currentPage.value++;

        // Fetch the next page of posts
        const morePosts = await queryCollection('blog').select('path', 'image', 'title', 'description', 'categoryText', 'categorySlug').where('language', '=', locale.value).order('datePublished', 'DESC').skip((currentPage.value - 1) * postsPerPage).limit(postsPerPage).all();
        if (morePosts.length === 0) {
            hasMorePosts.value = false;
            return;
        }

        // Append new posts and update pagination state
        posts.value = [...posts.value, ...mapPostLinks(morePosts)];
        hasMorePosts.value = posts.value.length < totalPosts.value;
    } catch (error) {
        console.error('Error loading more blog posts:', error);
    } finally {
        isLoading.value = false;
    }
};

// Define SEO metadata
useSeoMeta(createSEOMetatags({
    title: t('seo.blog.title'),
    description: t('seo.blog.description'),
    url: route.path
}));

// Define head metadata
useHead({
    htmlAttrs: {
        lang: localeHead.value.htmlAttrs.lang,
        dir: localeHead.value.htmlAttrs.dir
    },
    link: [...(localeHead.value.link || [])],
    ...createPageSchema({
        title: t('seo.blog.title'),
        description: t('seo.blog.description'),
        url: route.path,
        breadcrumbs: [
            { name: t('seo.home.breadcrumb'), item: localePath('/') },
            { name: t('seo.blog.breadcrumb'), item: localePath('/blog') }
        ]
    })
});

// Define page metadata
definePageMeta({
    layout: 'landing'
});
</script>

<template>
    <div class="space-y-12">
        <!-- Header section -->
        <BlogHeaderSection :badges="headerBadges" :title="t('blog.title')" :description="t('blog.description')" />

        <!-- Header carousel -->
        <div>
            <!-- Section title -->
            <BlogSectionTitle :title="t('blog.latestPosts')" />

            <!-- Carousel component -->
            <HeaderCarousel :featured-posts="featuredPosts" />
        </div>

        <!-- Categories section -->
        <div>
            <!-- Section title -->
            <BlogSectionTitle :title="t('blog.categories.title')" />

            <!-- Categories list component -->
            <CategoriesSection :categories="categories" />
        </div>

        <!-- Tags section -->
        <div v-if="tags.length">
            <!-- Section title -->
            <BlogSectionTitle :title="t('blog.tags.title')" />

            <!-- Tags list -->
            <div class="flex flex-wrap gap-3">
                <NuxtLinkLocale v-for="tag in tags" :key="tag.slug" :to="`/blog/tags/${tag.slug}`">
                    <Badge color="gray" :text="`${tag.name} (${tag.count})`" class="transition-transform duration-200 ease-out hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100" />
                </NuxtLinkLocale>
            </div>
        </div>

        <!-- All posts section -->
        <div>
            <!-- Section title -->
            <BlogSectionTitle :title="t('blog.allPosts')" data-aos="fade-up" />

            <!-- All posts list component -->
            <AllPostsSection :posts="posts"
                :current-page="currentPage"
                :posts-per-page="postsPerPage"
                :total-posts="totalPosts"
                :has-more-posts="hasMorePosts"
                :is-loading="isLoading"
                @load-more="loadMorePosts" />
        </div>
    </div>
</template>