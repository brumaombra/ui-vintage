<script setup>
import { BlogPostPage, buildCategoriesFromPosts, normalizeContentPath, sortByStableSeed } from '@brumaombra/ui-vintage/blog';
import { createSEOMetatags, createPageSchema, SITE_URL } from '~/composables/useUtils.js';
import BlogPostCta from '~/components/blog/BlogPostCta.vue';

const { t, locale } = useI18n();
const localeHead = useLocaleHead();
const localePath = useLocalePath();
const route = useRoute();
const { slug } = route.params;
const postPath = normalizeContentPath(route.path); // The content path has no trailing slash, the URL may
const relatedSeed = `${locale.value}-${slug}`; // Same related items for a post on every render

// Fetch single post
const { data: post } = await useAsyncData(`post-${slug}-${locale.value}`, async () => {
	return await queryCollection('blog').path(postPath).first();
});

// Unknown post: show the 404 page
if (!post.value) {
	throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true });
}

// Fetch related posts
const { data: relatedPosts } = await useAsyncData(`related-posts-${slug}-${locale.value}`, async () => {
	// Get all posts except current post
	const posts = await queryCollection('blog').select('title', 'description', 'image', 'categoryText', 'path').where('language', '=', locale.value).where('path', '<>', postPath).all();

	// Return 4 posts in a stable order for this post
	return sortByStableSeed(posts || [], relatedSeed, relatedPost => relatedPost.path || relatedPost.title).slice(0, 4);
});

// Fetch related categories
const { data: relatedCategories } = await useAsyncData(`related-categories-${slug}-${locale.value}`, async () => {
	// Get all posts excluding current post's category
	const posts = await queryCollection('blog').select('categorySlug', 'categoryText', 'image').where('language', '=', locale.value).where('categorySlug', '<>', post.value?.categorySlug).order('datePublished', 'DESC').all();
	const categories = buildCategoriesFromPosts(posts || [], category => localePath(`/blog/categories/${category}`));

	// Return 4 categories in a stable order for this post
	return sortByStableSeed(categories, relatedSeed, category => category.slug || category.name).slice(0, 4);
});

// Define SEO metadata
useSeoMeta(createSEOMetatags({
	title: post.value?.title,
	description: post.value?.description,
	url: route.path,
	image: post.value?.image,
	type: 'article',
	publishedTime: post.value?.datePublished,
	modifiedTime: post.value?.dateModified
}));

// Define head metadata
useHead({
	htmlAttrs: {
		lang: localeHead.value.htmlAttrs.lang,
		dir: localeHead.value.htmlAttrs.dir
	},
	link: [...(localeHead.value.link || [])],
	...createPageSchema({
		title: post.value?.title,
		description: post.value?.description,
		summary: post.value?.summary, // Short answer of the post, for answer engines (not shown on the page)
		url: route.path,
		isBlogPost: true,
		image: post.value?.image,
		tags: post.value?.tags,
		datePublished: post.value?.datePublished,
		dateModified: post.value?.dateModified,
		author: post.value?.author,
		authorUrl: post.value?.authorUrl,
		authorImageUrl: post.value?.authorImageUrl,
		faqs: post.value?.faqs,
		breadcrumbs: [
			{ name: t('seo.home.breadcrumb'), item: localePath('/') },
			{ name: t('seo.blog.breadcrumb'), item: localePath('/blog') },
			{ name: post.value?.title, item: route.path }
		]
	})
});

// Define page metadata
definePageMeta({
	layout: 'landing'
});
</script>

<template>
	<!-- Blog post: header, content, FAQ, author, related posts and categories -->
	<BlogPostPage :post="post"
		:url="`${SITE_URL}${route.path}`"
		:related-posts="relatedPosts"
		:related-categories="relatedCategories">
		<!-- App call to action after the article -->
		<template #after-article>
			<BlogPostCta />
		</template>
	</BlogPostPage>
</template>