<script setup lang="ts">
import { computed, ref } from 'vue';
import { AllPostsSection, BlogHeaderSection, BlogSectionTitle, CategoriesSection, HeaderCarousel } from '@brumaombra/ui-vintage/blog';
import { useBlogCategories, useBlogDemoPosts, useBlogPostsPerPage, useFeaturedBlogPosts } from '~/composables/useDemoBlogData.js';

useHead({
    title: 'Blog Demo'
});

const currentPage = ref(1);
const isLoading = ref(false);
const blogCategories = useBlogCategories();
const blogDemoPosts = useBlogDemoPosts();
const blogPostsPerPage = useBlogPostsPerPage();
const featuredBlogPosts = useFeaturedBlogPosts();
const visiblePosts = ref(blogDemoPosts.slice(0, blogPostsPerPage));

const headerBadges = [{ color: 'blue', text: 'Shared Components' }, { color: 'green', text: 'Static Demo Data' }, { color: 'gray', text: 'No Content Module' }];

const totalPosts = blogDemoPosts.length;

const hasMorePosts = computed(() => visiblePosts.value.length < totalPosts);

const loadMorePosts = () => {
    if (isLoading.value || !hasMorePosts.value) {
        return;
    }

    isLoading.value = true;

    window.setTimeout(() => {
        currentPage.value += 1;
        visiblePosts.value = blogDemoPosts.slice(0, currentPage.value * blogPostsPerPage);
        isLoading.value = false;
    }, 250);
};
</script>

<template>
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-10 md:px-6 lg:px-8">
        <BlogHeaderSection
            :badges="headerBadges"
            title="A reusable blog surface for product teams"
            description="This demo mirrors the structure used in krowdcall, but everything here is powered by fixed objects so the showcase stays self-contained inside the library workspace."
        />

        <section class="space-y-5">
            <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <BlogSectionTitle title="Latest posts" />
                    <p class="text-sm text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]">
                        Featured stories rotate automatically and link through to the static detail pages in this demo app.
                    </p>
                </div>

                <NuxtLink to="/blog/categories" class="text-sm font-semibold text-[var(--text-primary-light)] underline underline-offset-4 transition-opacity hover:opacity-70 dark:text-[var(--text-primary-dark)]">
                    Browse all categories
                </NuxtLink>
            </div>

            <HeaderCarousel :featured-posts="featuredBlogPosts" />
        </section>

        <section class="space-y-5">
            <BlogSectionTitle title="Categories" />
            <p class="text-sm text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]">
                The category grid uses the shared section wrapper and drives into dedicated category pages.
            </p>
            <CategoriesSection :categories="blogCategories" />
        </section>

        <section class="space-y-5">
            <BlogSectionTitle title="All posts" />
            <p class="text-sm text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]">
                Load more uses a local array slice so the component can be tested without a backend or content module.
            </p>
            <AllPostsSection
                :posts="visiblePosts"
                :current-page="currentPage"
                :posts-per-page="blogPostsPerPage"
                :total-posts="totalPosts"
                :has-more-posts="hasMorePosts"
                :is-loading="isLoading"
                @load-more="loadMorePosts"
            />
        </section>
    </div>
</template>