<script setup>
import { ref } from 'vue';
import { News01Icon } from '@hugeicons/core-free-icons';
import { BlogHeaderSection, PostsList } from '@brumaombra/ui-vintage/blog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@brumaombra/ui-vintage/breadcrumb';
import { LoadMoreButton } from '@brumaombra/ui-vintage/load-more-button';
import { createPageSchema, createSEOMetatags } from '~/composables/useUtils.js';

const { t, locale } = useI18n();
const localeHead = useLocaleHead();
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
            queryCollection('blog').select('categoryText').where('categorySlug', '=', slug).where('language', '=', locale.value).first(),
            queryCollection('blog').select('title', 'description', 'image', 'categoryText', 'path').where('language', '=', locale.value).where('categorySlug', '=', slug).order('datePublished', 'DESC').limit(postsPerPage).all(),
            queryCollection('blog').where('categorySlug', '=', slug).where('language', '=', locale.value).count()
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

// Unknown category (no posts): show the 404 page
if (!categoryData.value?.totalPosts) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found', fatal: true });
}

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
        const morePosts = await queryCollection('blog').select('title', 'description', 'image', 'categoryText', 'path').where('categorySlug', '=', slug).where('language', '=', locale.value).order('datePublished', 'DESC').skip((currentPage.value - 1) * postsPerPage).limit(postsPerPage).all();
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

// Define SEO metadata
useSeoMeta(createSEOMetatags({
    title: t('seo.blog.category.title', { category: categoryTitle }),
    description: t('seo.blog.category.description', { category: categoryTitle }),
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
        title: t('seo.blog.category.title', { category: categoryTitle }),
        description: t('seo.blog.category.description', { category: categoryTitle }),
        url: route.path,
        breadcrumbs: [
            { name: t('seo.home.breadcrumb'), item: localePath('/') },
            { name: t('seo.blog.breadcrumb'), item: localePath('/blog') },
            { name: t('seo.categories.breadcrumb'), item: localePath('/blog/categories') },
            { name: categoryTitle, item: route.path }
        ]
    })
});

// Define page metadata
definePageMeta({
    layout: 'landing'
});
</script>

<template>
    <div>
        <!-- Breadcrumbs -->
        <Breadcrumb class="mb-2 flex animate-uv-fade-up justify-center">
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
        <BlogHeaderSection :title="categoryTitle"
            :highlight="categoryTitle"
            :description="t('blog.categories.singleCategoryDescription', { category: categoryTitle })"
            :stats="[{ icon: News01Icon, value: totalPosts, label: t('blog.header.stats.posts', totalPosts) }]"
            class="mb-12 md:mb-16" />

        <!-- Posts -->
        <PostsList :posts="posts" />

        <!-- Load more button -->
        <LoadMoreButton v-if="hasMorePosts" :busy="isLoading" :text="t('common.loadMoreWithNumbers', {
            current: Math.min(currentPage * postsPerPage, totalPosts),
            total: totalPosts
        })" @load-more="loadMorePosts" class="mt-8" data-aos="blur-up" />
    </div>
</template>