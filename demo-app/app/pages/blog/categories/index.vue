<script setup>
import { useI18n } from 'vue-i18n';
import { BlogCategoriesPage, buildCategoriesFromPosts } from '@brumaombra/ui-vintage/blog';
import { createSEOMetatags, createPageSchema } from '~/composables/useUtils.js';

const { t, locale } = useI18n();
const localeHead = useLocaleHead();
const localePath = useLocalePath();
const route = useRoute();

// Fetch blog categories data
const { data: categories } = await useAsyncData(`blog-categories-${locale.value}`, async () => {
	// Fetch all blog posts
	const posts = await queryCollection('blog').select('categorySlug', 'categoryText', 'image').where('language', '=', locale.value).order('datePublished', 'DESC').all();

	// Return built categories
	return buildCategoriesFromPosts(posts);
});

// Define SEO metadata
useSeoMeta(createSEOMetatags({
	title: t('seo.categories.title'),
	description: t('seo.categories.description'),
	url: route.path
}));

// Define head metadata
useHead({
	// HTML attributes
	htmlAttrs: {
		lang: localeHead.value.htmlAttrs.lang, // Language
		dir: localeHead.value.htmlAttrs.dir // Text direction
	},

	// Hreflang attributes for different languages
	link: [...(localeHead.value.link || [])],

	// JSON-LD schema for the page
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