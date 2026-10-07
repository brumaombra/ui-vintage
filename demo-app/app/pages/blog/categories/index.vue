<script setup>
import { computed } from 'vue';
import { FolderLibraryIcon, News01Icon } from '@hugeicons/core-free-icons';
import { BlogHeaderSection, CategoriesList } from '@brumaombra/ui-vintage/blog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@brumaombra/ui-vintage/breadcrumb';
import { createPageSchema, createSEOMetatags } from '~/composables/useUtils.js';

const { t, locale } = useI18n();
const localeHead = useLocaleHead();
const localePath = useLocalePath();
const route = useRoute();

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
    const posts = await queryCollection('blog').select('categorySlug', 'categoryText', 'image').where('language', '=', locale.value).all();
    return buildCategoriesFromPosts(posts);
});

// Category totals shown under the header
const headerStats = computed(() => {
    const categories = blogCategories.value || [];
    const postCount = categories.reduce((total, category) => total + category.count, 0);
    return [
        { icon: FolderLibraryIcon, value: categories.length, label: t('blog.header.stats.categories', categories.length) },
        { icon: News01Icon, value: postCount, label: t('blog.header.stats.posts', postCount) }
    ];
});

// Define SEO metadata
useSeoMeta(createSEOMetatags({
    title: t('seo.categories.title'),
    description: t('seo.categories.description'),
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
        title: t('seo.categories.title'),
        description: t('seo.categories.description'),
        url: route.path,
        breadcrumbs: [
            { name: t('seo.home.breadcrumb'), item: localePath('/') },
            { name: t('seo.blog.breadcrumb'), item: localePath('/blog') },
            { name: t('seo.categories.breadcrumb'), item: localePath('/blog/categories') }
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
                    <BreadcrumbPage>
                        {{ t('navigation.breadcrumbs.categories') }}
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        <!-- Blog header -->
        <BlogHeaderSection :title="t('blog.categories.title')"
            :highlight="t('blog.categories.title')"
            :description="t('blog.categories.description')"
            :stats="headerStats"
            class="mb-12 md:mb-16" />

        <!-- Categories section -->
        <CategoriesList :categories="blogCategories || []" />
    </div>
</template>