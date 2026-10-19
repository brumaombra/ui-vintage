<script setup>
import { useI18n } from 'vue-i18n';
import { BlogTagsPage, buildTagsFromPosts } from '@brumaombra/ui-vintage/blog';
import { createSEOMetatags, createPageSchema } from '~/composables/useUtils.js';

const { t, locale } = useI18n();
const localeHead = useLocaleHead();
const localePath = useLocalePath();
const route = useRoute();

// Fetch tags data
const { data: tags } = await useAsyncData(`blog-tags-${locale.value}`, async () => {
	try {
		const posts = await queryCollection('blog').select('tags').where('language', '=', locale.value).order('datePublished', 'DESC').all();
		return buildTagsFromPosts(posts);
	} catch (error) {
		console.error('Error loading blog tags:', error);
		return [];
	}
});

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
	<!-- All the blog tags -->
	<BlogTagsPage :description="t('blog.tags.description')" :tags="tags || []" />
</template>