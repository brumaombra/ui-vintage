<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { AllPostsSection, BlogHeaderSection, BlogSectionTitle, CategoriesSection, HeaderCarousel } from '@brumaombra/ui-vintage/blog';

const { locale } = useI18n();
const localePath = useLocalePath();
const currentPage = ref(1);
const postsPerPage = 1;
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
        const [featuredPosts, initialPosts, totalPosts, categoryPosts] = await Promise.all([
            queryCollection('blog').select('path', 'image', 'title', 'description', 'categoryText', 'categorySlug').where('language', '=', locale.value).order('datePublished', 'DESC').limit(4).all(),
            queryCollection('blog').select('path', 'image', 'title', 'description', 'categoryText', 'categorySlug').where('language', '=', locale.value).order('datePublished', 'DESC').limit(postsPerPage).all(),
            queryCollection('blog').where('language', '=', locale.value).count(),
            queryCollection('blog').select('categorySlug', 'categoryText', 'image').where('language', '=', locale.value).all()
        ]);

        // Return the data
        return {
            featuredPosts: mapPostLinks(featuredPosts),
            initialPosts: mapPostLinks(initialPosts),
            totalPosts,
            categories: buildCategoriesFromPosts(categoryPosts)
        };
    } catch (error) {
        console.error('Error loading blog index data:', error);
        return {
            featuredPosts: [],
            initialPosts: [],
            totalPosts: 0,
            categories: []
        };
    }
});

// Initialize reactive states
const featuredPosts = blogIndexData.value?.featuredPosts || [];
const posts = ref(blogIndexData.value?.initialPosts || []);
const totalPosts = ref(blogIndexData.value?.totalPosts || 0);
const categories = blogIndexData.value?.categories || [];
const hasMorePosts = ref(posts.value.length < totalPosts.value);

// List of badges for the header section
const headerBadges = [
    { color: 'blue', text: 'Production-Like Demo' },
    { color: 'green', text: 'Nuxt Content' },
    { color: 'gray', text: 'Real Markdown Posts' }
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

// Add metatags
useHead({
    title: 'Blog Demo'
});

// Define page metadata
definePageMeta({
    layout: 'landing'
});
</script>

<template>
    <div class="space-y-12">
        <!-- Header section -->
        <BlogHeaderSection :badges="headerBadges" title="A reusable blog surface for product teams" description="This demo now uses real markdown content, collection queries, and full article routes so the blog showcase behaves like a production consumer of the library." />

        <!-- Header carousel -->
        <div>
            <!-- Section title -->
            <BlogSectionTitle title="Latest posts" />

            <!-- Carousel component -->
            <HeaderCarousel :featured-posts="featuredPosts" />
        </div>

        <!-- Categories section -->
        <div>
            <!-- Section title -->
            <BlogSectionTitle title="Categories" />

            <!-- Categories list component -->
            <CategoriesSection :categories="categories" />
        </div>

        <!-- All posts section -->
        <div>
            <!-- Section title -->
            <BlogSectionTitle title="All posts" data-aos="fade-up" />

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