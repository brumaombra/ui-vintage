<script setup>
import { ref } from 'vue';
import { BlogPostsPage, slugify } from '@brumaombra/ui-vintage/blog';
import { createSEOMetatags, createPageSchema } from '~/composables/useUtils.js';

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

// Unknown tag (no posts): show the 404 page
if (!tagData.value?.totalPosts) {
	throw createError({ statusCode: 404, statusMessage: 'Tag not found', fatal: true });
}

// Initialize reactive states
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
	<!-- Posts with a tag -->
	<BlogPostsPage section="tags"
		:title="tagTitle"
		:description="t('blog.tags.singleTagDescription', { tag: tagTitle })"
		:posts="posts"
		:total-posts="totalPosts"
		:current-page="currentPage"
		:posts-per-page="postsPerPage"
		:has-more-posts="hasMorePosts"
		:is-loading="isLoading"
		@load-more="loadMorePosts" />
</template>