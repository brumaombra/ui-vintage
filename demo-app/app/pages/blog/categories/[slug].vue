<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { PostsList } from '@brumaombra/ui-vintage/blog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@brumaombra/ui-vintage/breadcrumb';
import { LoadMoreButton } from '@brumaombra/ui-vintage/load-more-button';
import { PageHeader } from '@brumaombra/ui-vintage/page-header';

const { t, locale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const { slug } = route.params;
const currentPage = ref(1);
const postsPerPage = 9;
const isLoading = ref(false);

// Map post links to include localized paths
const mapPostLinks = posts => {
    return posts.map(post => ({
        ...post,
        path: localePath(post.path)
    }));
};

// Fetch prerendered category page data
const { data: categoryData } = await useAsyncData(`category-${slug}-${locale.value}-posts`, async () => {
    try {
        // Execute queries in parallel
        const [categoryPost, posts, totalPostsCount] = await Promise.all([
            queryCollection('blog').select('categoryText').where('categorySlug', '=', slug).where('language', '=', 'en').first(),
            queryCollection('blog').select('title', 'description', 'image', 'categoryText', 'path').where('language', '=', 'en').where('categorySlug', '=', slug).limit(postsPerPage).all(),
            queryCollection('blog').where('categorySlug', '=', slug).where('language', '=', 'en').count()
        ]);

        // Return the data
        return {
            categoryTitle: categoryPost?.categoryText || slug,
            posts: mapPostLinks(posts),
            totalPosts: totalPostsCount || 0
        };
    } catch (error) {
        console.error('Error loading posts:', error);
        return {
            categoryTitle: slug,
            posts: [],
            totalPosts: 0
        };
    }
});

// Initialize reactive states
const categoryTitle = categoryData.value?.categoryTitle || slug;
const posts = ref(categoryData.value?.posts || []);
const totalPosts = categoryData.value?.totalPosts || 0;
const hasMorePosts = ref(posts.value.length < totalPosts);

// Load more posts (client-side)
const loadMorePosts = async () => {
    isLoading.value = true;
    try {
        currentPage.value++;
        const morePosts = await queryCollection('blog').select('title', 'description', 'image', 'categoryText', 'path').where('categorySlug', '=', slug).where('language', '=', 'en').skip((currentPage.value - 1) * postsPerPage).limit(postsPerPage).all();
        if (morePosts.length === 0) {
            hasMorePosts.value = false;
        } else {
            posts.value = [...posts.value, ...mapPostLinks(morePosts)];
            hasMorePosts.value = currentPage.value * postsPerPage < totalPosts;
        }
    } catch (error) {
        console.error('Error loading more posts:', error);
    } finally {
        isLoading.value = false;
    }
};

// Add metatags
useHead(() => ({
    title: categoryData.value ? `${categoryData.value.categoryTitle} Demo` : 'Category Demo'
}));

// Define page metadata
definePageMeta({
    layout: 'landing'
});
</script>

<template>
    <div>
        <!-- Breadcrumbs -->
        <Breadcrumb class="mb-8">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink as-child>
                        <NuxtLinkLocale to="/">
                            {{ t('navigation.breadcrumbs.home') }}
                        </NuxtLinkLocale>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink as-child>
                        <NuxtLinkLocale to="/blog">
                            {{ t('navigation.breadcrumbs.blog') }}
                        </NuxtLinkLocale>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink as-child>
                        <NuxtLinkLocale to="/blog/categories">
                            {{ t('navigation.breadcrumbs.categories') }}
                        </NuxtLinkLocale>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>
                        {{ categoryTitle }}
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        <!-- Blog header -->
        <div class="mb-12">
            <PageHeader :title="categoryTitle" />
            <p class="text-sm md:!text-base text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]">
                A focused view of every demo article published under this category.
            </p>
        </div>

        <!-- Posts -->
        <PostsList :posts="posts" />

        <!-- Load more button -->
        <LoadMoreButton v-if="hasMorePosts" :busy="isLoading" :text="t('common.loadMoreWithNumbers', {
            current: Math.min(currentPage * postsPerPage, totalPosts),
            total: totalPosts
        })" @load-more="loadMorePosts" class="mt-8" data-aos="fade-up" />
    </div>
</template>