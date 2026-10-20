<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { slugify } from './blogPageUtils';
import type { BlogCategoryData } from './blogPageUtils';
import BlogContentRenderer from './BlogContentRenderer.vue';
import BlogFAQSection from './BlogFAQSection.vue';
import BlogInfoSection from './BlogInfoSection.vue';
import BlogPostHeader from './BlogPostHeader.vue';
import BlogSectionTitle from './BlogSectionTitle.vue';
import BlogSummary from './BlogSummary.vue';
import BlogViewAllLink from './BlogViewAllLink.vue';
import CategoryCard from './CategoryCard.vue';
import PostCard from './PostCard.vue';
import SocialShareSidebar from './SocialShareSidebar.vue';
import TableOfContents from './TableOfContents.vue';

// Props (post is the Nuxt Content entry of the blog collection, url its absolute address for sharing)
const props = withDefaults(defineProps<{
	post: Record<string, any>;
	url: string;
	relatedPosts?: Array<{
		path: string;
		title: string;
		description?: string;
		image?: string;
		categoryText?: string;
	}>;
	relatedCategories?: BlogCategoryData[];
}>(), {
	relatedPosts: () => [],
	relatedCategories: () => []
});

const { t } = useI18n();

// Tags of the post as badges (tags that can't produce a URL slug are skipped)
const postTags = computed(() => ((props.post.tags as string[] | undefined) || [])
	.map(tag => ({ name: tag, slug: slugify(tag) }))
	.filter(tag => tag.slug));
</script>

<template>
	<div class="mx-auto max-w-4xl">
		<article>
			<!-- Article header -->
			<BlogPostHeader :title="props.post.title"
				:description="props.post.description"
				:image="props.post.image"
				:author="props.post.author"
				:author-image-url="props.post.authorImageUrl"
				:date-published="props.post.datePublished"
				:category-text="props.post.categoryText"
				:category-slug="props.post.categorySlug"
				:tags="postTags"
				:body="props.post.body" />

			<!-- Short answer of the post (the summary field of the frontmatter) -->
			<BlogSummary v-if="props.post.summary" :summary="props.post.summary" />

			<!-- Table of contents -->
			<TableOfContents :content="props.post" />

			<!-- Social share sidebar -->
			<SocialShareSidebar :title="props.post.title" :url="props.url" />

			<!-- Article content -->
			<BlogContentRenderer :value="props.post" />

			<!-- Divider (the app's own ProseHr content component, lazy like the copy Nuxt Content loads for markdown) -->
			<LazyProseHr />

			<!-- FAQ section -->
			<BlogFAQSection v-if="props.post.faqs?.length" :faqs="props.post.faqs" />

			<!-- Divider -->
			<LazyProseHr />

			<!-- Blog info section -->
			<BlogInfoSection :author="props.post.author"
				:author-url="props.post.authorUrl"
				:author-image-url="props.post.authorImageUrl"
				:date-published="props.post.datePublished"
				:date-modified="props.post.dateModified" />

			<!-- App content after the article (e.g. a call to action) -->
			<slot name="after-article" />
		</article>

		<!-- Related posts -->
		<section v-if="props.relatedPosts.length" class="mt-16 md:mt-24">
			<BlogSectionTitle :title="t('uiVintage.blog.readAlso')" />
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<NuxtLinkLocale v-for="(relatedPost, index) in props.relatedPosts" :key="relatedPost.path" :to="relatedPost.path" data-aos="blur-up" :data-aos-delay="(index % 2) * 90" class="block h-full rounded outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45">
					<PostCard :image="relatedPost.image"
						:category="relatedPost.categoryText"
						:title="relatedPost.title"
						:description="relatedPost.description"
						class="h-full" />
				</NuxtLinkLocale>
			</div>
		</section>

		<!-- Related categories -->
		<section v-if="props.relatedCategories.length" class="mt-16 md:mt-24">
			<BlogSectionTitle :title="t('uiVintage.blog.exploreCategories')">
				<template #action>
					<BlogViewAllLink to="/blog/categories" :label="t('uiVintage.blog.exploreAllCategories')" />
				</template>
			</BlogSectionTitle>
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<NuxtLinkLocale v-for="(category, index) in props.relatedCategories" :key="category.slug" :to="`/blog/categories/${category.slug}`" data-aos="blur-up" :data-aos-delay="(index % 2) * 90" class="block h-full rounded outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45">
					<CategoryCard :name="category.name"
						:image="category.image"
						:count="category.count" />
				</NuxtLinkLocale>
			</div>
		</section>
	</div>
</template>