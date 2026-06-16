<script setup>
import { useI18n } from 'vue-i18n';
import { CategoriesList } from '@brumaombra/ui-vintage/blog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@brumaombra/ui-vintage/breadcrumb';
import { PageHeader } from '@brumaombra/ui-vintage/page-header';

const { locale } = useI18n();
const localePath = useLocalePath();

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

// Fetch blog categories data
const { data: blogCategories } = await useAsyncData(`demo-blog-categories-${locale.value}`, async () => {
    const posts = await queryCollection('blog').select('categorySlug', 'categoryText', 'image').where('language', '=', 'en').all();
    return buildCategoriesFromPosts(posts);
});

// Add metatags
useHead({
    title: 'Blog Categories Demo'
});

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
                        Categories
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        <!-- Blog header -->
        <div class="mb-12">
            <PageHeader title="Browse every category" />
            <p class="text-sm md:!text-base text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]">
                Each category is derived from the real markdown posts in the demo content collection.
            </p>
        </div>

        <!-- Categories section -->
        <CategoriesList :categories="blogCategories || []" />
    </div>
</template>