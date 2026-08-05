<script setup>
import { useI18n } from 'vue-i18n';
import { Bookmark01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { BlogFAQSection, BlogInfoSection, BlogSectionTitle, CategoryCard, PostCard, SocialShareSidebar, TableOfContents } from '@brumaombra/ui-vintage/blog';
import { Badge } from '@brumaombra/ui-vintage/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@brumaombra/ui-vintage/breadcrumb';
import { Button } from '@brumaombra/ui-vintage/button';
import ProseHr from '~/components/content/ProseHr.vue';

const { t, locale } = useI18n();
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

// Add metatags
useHead(() => ({
    title: post.value ? post.value.title : 'Blog Post Demo'
}));

// Define page metadata
definePageMeta({
    layout: 'landing'
});
</script>

<template>
    <div class="max-w-4xl mx-auto">
        <article v-if="post">
            <!-- Article header -->
            <header class="mb-6 sm:mb-8 lg:mb-12">
                <!-- Breadcrumbs -->
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink as-child>
                                <NuxtLinkLocale to="/">
                                    Home
                                </NuxtLinkLocale>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink as-child>
                                <NuxtLinkLocale to="/blog">
                                    Blog
                                </NuxtLinkLocale>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                {{ post?.title }}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <!-- Category badge -->
                <NuxtLinkLocale v-if="post.categoryText" :to="`/blog/categories/${post.categorySlug}`" class="inline-block my-4 md:my-6">
                    <Badge color="gray" :text="post.categoryText" class="transition-transform duration-200 ease-out hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100" />
                </NuxtLinkLocale>

                <!-- Title -->
                <h1 class="text-2xl sm:text-3xl! md:text-4xl! font-bold tracking-tight text-(--text-primary-light) dark:text-(--text-primary-dark) leading-tight mb-6">
                    {{ post.title }}
                </h1>

                <!-- Featured image -->
                <div v-if="post.image" class="relative w-full rounded-sm overflow-hidden aspect-video mb-6">
                    <NuxtImg :src="post.image" :alt="post.title" format="avif" quality="50" :sizes="{ 480: '480px', 1536: '896px' }" loading="eager" fetchpriority="high" preload class="w-full h-full object-cover" />
                </div>
            </header>

            <!-- Table of contents -->
            <TableOfContents :content="post" />

            <!-- Social share sidebar -->
            <SocialShareSidebar :title="post.title" :url="fullURL" />

            <!-- Article content -->
            <div class="prose prose-base sm:prose-lg max-w-none">
                <ContentRenderer :value="post" />
            </div>

            <!-- Divider -->
            <ProseHr />

            <!-- FAQ section -->
            <BlogFAQSection v-if="post.faqs && post.faqs?.length > 0"
                :faqs="post.faqs"
                data-aos="fade-up" />

            <!-- Divider -->
            <ProseHr />

            <!-- Blog info section -->
            <BlogInfoSection :author="post.author"
                :author-url="post.authorUrl"
                :author-image-url="post.authorImageUrl"
                :date-published="post.datePublished"
                :date-modified="post.dateModified" />
        </article>

        <!-- Divider -->
        <ProseHr />

        <!-- Related posts -->
        <section v-if="relatedPosts?.length" data-aos="fade-up">
            <!-- Title -->
            <BlogSectionTitle :title="t('blog.readAlso')" />

            <!-- Posts -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <NuxtLinkLocale v-for="relatedPost in relatedPosts" :key="relatedPost.path" :to="relatedPost.path" class="block h-full">
                    <PostCard :image="relatedPost.image"
                        :category="relatedPost.categoryText"
                        :title="relatedPost.title"
                        :description="relatedPost.description"
                        class="h-full" />
                </NuxtLinkLocale>
            </div>
        </section>

        <!-- Related categories -->
        <section v-if="relatedCategories?.length" class="mt-8 sm:mt-16">
            <!-- Title -->
            <BlogSectionTitle :title="t('blog.exploreCategories')" />

            <!-- Categories list -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <NuxtLinkLocale v-for="(category, index) in relatedCategories" :key="category.slug" :to="`/blog/categories/${category.slug}`" class="block h-full" data-aos="fade-up" :data-aos-delay="((index % 2) * 200) + 100">
                    <CategoryCard :name="category.name"
                        :image="category.image"
                        :count="category.count" />
                </NuxtLinkLocale>
            </div>

            <!-- Explore all categories button -->
            <div class="flex items-center justify-center mt-8 md:mt-10" data-aos="fade-up">
                <NuxtLinkLocale to="/blog/categories">
                    <Button variant="primary">
                        <HugeiconsIcon :icon="Bookmark01Icon" class="size-4" />
                        {{ t('blog.exploreAllCategories') }}
                    </Button>
                </NuxtLinkLocale>
            </div>
        </section>
    </div>
</template>

<style>
.prose h1 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 2rem;
}

.prose h2 {
    margin-top: 2rem;
    margin-bottom: 1.5rem;
}

.prose h2 a {
    font-size: 1.375rem;
    font-weight: 700;
    line-height: 2rem;
    color: var(--text-primary-light);
}

.dark .prose h2 a {
    color: var(--text-primary-dark);
}

.prose h3 {
    margin-top: 2rem;
    margin-bottom: 1rem;
}

.prose h3 a {
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.75rem;
    color: var(--text-primary-light);
}

.dark .prose h3 a {
    color: var(--text-primary-dark);
}

.prose p {
    font-size: 15px;
    margin-top: 1rem;
    margin-bottom: 1rem;
    line-height: 1.75;
    color: var(--text-primary-light);
}

.dark .prose p {
    color: var(--text-primary-dark);
}

.prose p strong {
    font-weight: 700;
}

.prose blockquote strong {
    font-weight: 700;
}

.prose img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 1.5rem;
}

.prose a {
    text-decoration: none;
    font-weight: 700;
}

/* Responsive styles */
@media (max-width: 640px) {

    .prose p {
        font-size: 13px;
        line-height: 1.75;
    }

    .prose h2 {
        margin-bottom: 1rem;
    }

}
</style>