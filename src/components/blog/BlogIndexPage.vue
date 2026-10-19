<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import FolderLibraryIcon from '@hugeicons/core-free-icons/FolderLibraryIcon';
import News01Icon from '@hugeicons/core-free-icons/News01Icon';
import Tag01Icon from '@hugeicons/core-free-icons/Tag01Icon';
import type { BlogCategoryData, BlogTagData } from './blogPageUtils';
import AllPostsSection from './AllPostsSection.vue';
import BlogHeaderSection from './BlogHeaderSection.vue';
import BlogSectionTitle from './BlogSectionTitle.vue';
import BlogTagsSection from './BlogTagsSection.vue';
import BlogViewAllLink from './BlogViewAllLink.vue';
import CategoriesSection from './CategoriesSection.vue';
import HeaderCarousel from './HeaderCarousel.vue';

// Post shown in the carousel and in the list (the links localize the paths)
type BlogListPost = {
	path: string;
	title: string;
	description?: string;
	image?: string;
	categoryText?: string;
	categorySlug?: string;
};

// Props
const props = withDefaults(defineProps<{
	title: string;
	highlight?: string;
	description: string;
	featuredPosts?: BlogListPost[];
	categories?: BlogCategoryData[];
	tags?: BlogTagData[];
	posts?: BlogListPost[];
	totalPosts?: number;
	currentPage?: number;
	postsPerPage?: number;
	hasMorePosts?: boolean;
	isLoading?: boolean;
}>(), {
	highlight: '',
	featuredPosts: () => [],
	categories: () => [],
	tags: () => [],
	posts: () => [],
	totalPosts: 0,
	currentPage: 1,
	postsPerPage: 9,
	hasMorePosts: false,
	isLoading: false
});

// Emits
const emit = defineEmits<{
	'load-more': [];
}>();

const { t } = useI18n();

// Featured posts with the link to their category page
const carouselPosts = computed(() => props.featuredPosts.map(post => ({
	...post,
	categoryPath: post.categorySlug ? `/blog/categories/${post.categorySlug}` : undefined
})));

// Announce the latest post in the header
const headerAnnouncement = computed(() => props.featuredPosts[0] ? { text: props.featuredPosts[0].title, to: props.featuredPosts[0].path } : null);

// Blog totals shown under the header
const headerStats = computed(() => [
	{ icon: News01Icon, value: props.totalPosts, label: t('uiVintage.blog.stats.posts', props.totalPosts) },
	{ icon: FolderLibraryIcon, value: props.categories.length, label: t('uiVintage.blog.stats.categories', props.categories.length) },
	{ icon: Tag01Icon, value: props.tags.length, label: t('uiVintage.blog.stats.tags', props.tags.length) }
]);
</script>

<template>
	<div class="space-y-16 md:space-y-24">
		<!-- Header section -->
		<BlogHeaderSection :announcement="headerAnnouncement"
			:title="props.title"
			:highlight="props.highlight"
			:description="props.description"
			:stats="headerStats" />

		<!-- Header carousel -->
		<section>
			<BlogSectionTitle :title="t('uiVintage.blog.latestPosts')" :description="t('uiVintage.blog.latestPostsDescription')" />
			<HeaderCarousel :featured-posts="carouselPosts" />
		</section>

		<!-- Categories section -->
		<section>
			<BlogSectionTitle :title="t('uiVintage.blog.categories')" :description="t('uiVintage.blog.categoriesDescription')">
				<template #action>
					<BlogViewAllLink to="/blog/categories" :label="t('uiVintage.blog.viewAll')" />
				</template>
			</BlogSectionTitle>
			<CategoriesSection :categories="props.categories" />
		</section>

		<!-- Tags section -->
		<section v-if="props.tags.length">
			<BlogSectionTitle :title="t('uiVintage.blog.tags')" :description="t('uiVintage.blog.tagsDescription')">
				<template #action>
					<BlogViewAllLink to="/blog/tags" :label="t('uiVintage.blog.viewAll')" />
				</template>
			</BlogSectionTitle>
			<BlogTagsSection :tags="props.tags" />
		</section>

		<!-- All posts section -->
		<section>
			<BlogSectionTitle :title="t('uiVintage.blog.allPosts')" :description="t('uiVintage.blog.allPostsDescription')" />
			<AllPostsSection :posts="props.posts"
				:current-page="props.currentPage"
				:posts-per-page="props.postsPerPage"
				:total-posts="props.totalPosts"
				:has-more-posts="props.hasMorePosts"
				:is-loading="props.isLoading"
				@load-more="emit('load-more')" />
		</section>
	</div>
</template>