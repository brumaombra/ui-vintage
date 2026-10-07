<script setup>
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Tag01Icon, News01Icon } from '@hugeicons/core-free-icons';
import { BlogHeaderSection, BlogTagsSection } from '@brumaombra/ui-vintage/blog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@brumaombra/ui-vintage/breadcrumb';
import { buildTagsFromPosts, createPageSchema, createSEOMetatags } from '~/composables/useUtils.js';

const { t, locale } = useI18n();
const localeHead = useLocaleHead();
const localePath = useLocalePath();
const route = useRoute();

// Fetch tags data
const { data: tagsData } = await useAsyncData(`blog-tags-${locale.value}`, async () => {
    try {
        const posts = await queryCollection('blog').select('tags').where('language', '=', locale.value).all();
        return buildTagsFromPosts(posts);
    } catch (error) {
        console.error('Error loading blog tags:', error);
        return [];
    }
});

const tags = tagsData.value || [];

// Tag totals shown under the header
const tagUses = tags.reduce((total, tag) => total + (tag.count || 0), 0);
const headerStats = [
    { icon: Tag01Icon, value: tags.length, label: t('blog.header.stats.tags', tags.length) },
    { icon: News01Icon, value: tagUses, label: t('blog.header.stats.uses', tagUses) }
];

// Define SEO metadata
useSeoMeta(createSEOMetatags({
    title: t('seo.tags.title'),
    description: t('seo.tags.description'),
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
        title: t('seo.tags.title'),
        description: t('seo.tags.description'),
        url: route.path,
        breadcrumbs: [
            { name: t('seo.home.breadcrumb'), item: localePath('/') },
            { name: t('seo.blog.breadcrumb'), item: localePath('/blog') },
            { name: t('seo.tags.breadcrumb'), item: localePath('/blog/tags') }
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
                        {{ t('navigation.breadcrumbs.tags') }}
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        <!-- Blog header -->
        <BlogHeaderSection :title="t('blog.tags.title')"
            :highlight="t('blog.tags.title')"
            :description="t('blog.tags.description')"
            :stats="headerStats"
            class="mb-12 md:mb-16" />

        <!-- Tags list -->
        <BlogTagsSection :tags="tags" class="justify-center" />
    </div>
</template>