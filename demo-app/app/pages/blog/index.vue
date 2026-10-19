<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { BlogIndexPage, buildCategoriesFromPosts, buildTagsFromPosts } from '@brumaombra/ui-vintage/blog';
import { createSEOMetatags, createPageSchema } from '~/composables/useUtils.js';

const { t, locale } = useI18n();
const localeHead = useLocaleHead();
const localePath = useLocalePath();
const route = useRoute();
const currentPage = ref(1);
const postsPerPage = 9;
const isLoading = ref(false);

// Fetch blog index data
const { data: blogIndexData } = await useAsyncData(`blog-index-${locale.value}`, async () => {
	try {
		// Execute queries in parallel
		const [featuredPosts, initialPosts, totalPosts, categoryPosts, tagPosts] = await Promise.all([
			queryCollection('blog').select('id', 'path', 'image', 'title', 'description', 'categoryText', 'categorySlug').where('language', '=', locale.value).order('datePublished', 'DESC').limit(4).all(),
			queryCollection('blog').select('path', 'image', 'title', 'description', 'categoryText', 'categorySlug').where('language', '=', locale.value).order('datePublished', 'DESC').limit(postsPerPage).all(),
			queryCollection('blog').where('language', '=', locale.value).count(),
			queryCollection('blog').select('categorySlug', 'categoryText', 'image').where('language', '=', locale.value).order('datePublished', 'DESC').all(),
			queryCollection('blog').select('tags').where('language', '=', locale.value).order('datePublished', 'DESC').all()
		]);

		// Return the data
		return {
			featuredPosts,
			initialPosts,
			totalPosts,
			categories: buildCategoriesFromPosts(categoryPosts),
			tags: buildTagsFromPosts(tagPosts)
		};
	} catch (error) {
		console.error('Error loading blog index data:', error);
		return {
			featuredPosts: [],
			initialPosts: [],
			totalPosts: 0,
			categories: [],
			tags: []
		};
	}
});

// Initialize reactive states
const posts = ref(blogIndexData.value?.initialPosts || []);
const totalPosts = blogIndexData.value?.totalPosts || 0;
const hasMorePosts = ref(posts.value.length < totalPosts);

// Load more posts
const loadMorePosts = async () => {
	isLoading.value = true;

	try {
		currentPage.value++;

		// Fetch the next page of posts
		const morePosts = await queryCollection('blog').select('path', 'image', 'title', 'description', 'categoryText', 'categorySlug').where('language', '=', locale.value).order('datePublished', 'DESC').skip((currentPage.value - 1) * postsPerPage).limit(postsPerPage).all();
		if (morePosts.length === 0) {
			hasMorePosts.value = false;
			return;
		}

		// Append new posts and update pagination state
		posts.value = [...posts.value, ...morePosts];
		hasMorePosts.value = posts.value.length < totalPosts;
	} catch (error) {
		console.error('Error loading more blog posts:', error);
	} finally {
		isLoading.value = false;
	}
};

// Define SEO metadata
useSeoMeta(createSEOMetatags({
	title: t('seo.blog.title'),
	description: t('seo.blog.description'),
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
		title: t('seo.blog.title'),
		description: t('seo.blog.description'),
		url: route.path,
		breadcrumbs: [
			{ name: t('seo.home.breadcrumb'), item: localePath('/') },
			{ name: t('seo.blog.breadcrumb'), item: localePath('/blog') }
		]
	})
});

// Define page metadata
definePageMeta({
	layout: 'landing'
});
</script>

<template>
	<!-- Blog home: header, latest posts, categories, tags and all posts -->
	<BlogIndexPage :title="t('blog.title')"
		:highlight="t('blog.header.highlight')"
		:description="t('blog.description')"
		:featured-posts="blogIndexData?.featuredPosts"
		:categories="blogIndexData?.categories"
		:tags="blogIndexData?.tags"
		:posts="posts"
		:total-posts="totalPosts"
		:current-page="currentPage"
		:posts-per-page="postsPerPage"
		:has-more-posts="hasMorePosts"
		:is-loading="isLoading"
		@load-more="loadMorePosts" />
</template>