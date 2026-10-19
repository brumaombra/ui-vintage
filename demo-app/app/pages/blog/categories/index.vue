<script setup>
import { BlogCategoriesPage, buildCategoriesFromPosts } from '@brumaombra/ui-vintage/blog';
import { createSEOMetatags, createPageSchema } from '~/composables/useUtils.js';

const { t, locale } = useI18n();
const localeHead = useLocaleHead();
const localePath = useLocalePath();
const route = useRoute();

// Fetch blog categories data
const { data: categories } = await useAsyncData(`blog-categories-${locale.value}`, async () => {
	const posts = await queryCollection('blog').select('categorySlug', 'categoryText', 'image').where('language', '=', locale.value).order('datePublished', 'DESC').all();
	return buildCategoriesFromPosts(posts, category => localePath(`/blog/categories/${category}`));
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
	<!-- All the blog categories -->
	<BlogCategoriesPage :description="t('blog.categories.description')" :categories="categories || []" />
</template>