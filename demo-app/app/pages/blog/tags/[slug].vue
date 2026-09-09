<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { PostsList } from '@brumaombra/ui-vintage/blog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@brumaombra/ui-vintage/breadcrumb';
import { LoadMoreButton } from '@brumaombra/ui-vintage/load-more-button';
import { PageHeader } from '@brumaombra/ui-vintage/page-header';
import { createPageSchema, createSEOMetatags, slugify } from '~/composables/useUtils.js';

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

// Keep posts whose tags match the current tag slug
const filterPostsByTag = posts => {
    return posts.filter(post => (post.tags || []).some(tag => slugify(tag) === slug));
};

// Fetch prerendered tag page data
const { data: tagData } = await useAsyncData(`tag-${slug}-${locale.value}-posts`, async () => {
    try {
        const allPosts = await queryCollection('blog').select('title', 'description', 'image', 'categoryText', 'path', 'tags').where('language', '=', locale.value).order('datePublished', 'DESC').all();
        const matchingPosts = filterPostsByTag(allPosts);
        const matchingTag = matchingPosts.flatMap(post => post.tags || []).find(tag => slugify(tag) === slug);

        return {
            tagTitle: matchingTag || slug,
            posts: mapPostLinks(matchingPosts.slice(0, postsPerPage)),
            totalPosts: matchingPosts.length
        };
    } catch (error) {
        console.error('Error loading posts:', error);
        return {
            tagTitle: slug,
            posts: [],
            totalPosts: 0
        };
    }
});

const tagTitle = tagData.value?.tagTitle || slug;
const posts = ref(tagData.value?.posts || []);
const totalPosts = tagData.value?.totalPosts || 0;
const hasMorePosts = ref(posts.value.length < totalPosts);

// Load more posts (client-side)
const loadMorePosts = async () => {
    isLoading.value = true;
    try {
        currentPage.value++;
        const allPosts = await queryCollection('blog').select('title', 'description', 'image', 'categoryText', 'path', 'tags').where('language', '=', locale.value).order('datePublished', 'DESC').all();
        const matchingPosts = mapPostLinks(filterPostsByTag(allPosts));
        const nextPosts = matchingPosts.slice(0, currentPage.value * postsPerPage);

        posts.value = nextPosts;
        hasMorePosts.value = nextPosts.length < matchingPosts.length;
    } catch (error) {
        console.error('Error loading more posts:', error);
    } finally {
        isLoading.value = false;
    }
};

// Define SEO metadata
useSeoMeta(createSEOMetatags({
    title: t('seo.blog.tag.title', { tag: tagTitle }),
    description: t('seo.blog.tag.description', { tag: tagTitle }),
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
        title: t('seo.blog.tag.title', { tag: tagTitle }),
        description: t('seo.blog.tag.description', { tag: tagTitle }),
        url: route.path,
        breadcrumbs: [
            { name: t('seo.home.breadcrumb'), item: localePath('/') },
            { name: t('seo.blog.breadcrumb'), item: localePath('/blog') },
            { name: t('seo.tags.breadcrumb'), item: localePath('/blog/tags') },
            { name: tagTitle, item: route.path }
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
                        <NuxtLinkLocale to="/blog/tags">
                            {{ t('navigation.breadcrumbs.tags') }}
                        </NuxtLinkLocale>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>
                        {{ tagTitle }}
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        <!-- Blog header -->
        <div class="mb-12">
            <PageHeader :title="tagTitle" />
            <p class="text-sm md:text-base! text-(--text-secondary-light) dark:text-(--text-secondary-dark)">
                {{ t('blog.tags.singleTagDescription', { tag: tagTitle }) }}
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