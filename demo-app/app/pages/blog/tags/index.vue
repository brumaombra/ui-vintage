<script setup>
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Badge } from '@brumaombra/ui-vintage/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@brumaombra/ui-vintage/breadcrumb';
import { PageHeader } from '@brumaombra/ui-vintage/page-header';
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
                    <BreadcrumbPage>
                        {{ t('navigation.breadcrumbs.tags') }}
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        <!-- Blog header -->
        <div class="mb-12">
            <PageHeader :title="t('blog.tags.title')" />
            <p class="text-sm md:text-base! text-(--text-secondary-light) dark:text-(--text-secondary-dark)">
                {{ t('blog.tags.description') }}
            </p>
        </div>

        <!-- Tags list -->
        <div class="flex flex-wrap gap-3">
            <NuxtLinkLocale v-for="tag in tags" :key="tag.slug" :to="`/blog/tags/${tag.slug}`">
                <Badge color="gray" :text="`${tag.name} (${tag.count})`" class="transition-transform duration-200 ease-out hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100" />
            </NuxtLinkLocale>
        </div>
    </div>
</template>