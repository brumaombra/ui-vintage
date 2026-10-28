<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import News01Icon from '@hugeicons/core-free-icons/News01Icon';
import { LoadMoreButton } from '../load-more-button';
import BlogHeaderSection from './BlogHeaderSection.vue';
import BlogPageBreadcrumbs from './BlogPageBreadcrumbs.vue';
import PostsList from './PostsList.vue';

// Props (the posts of a category or a tag, the links localize their paths)
const props = withDefaults(defineProps<{
	section: 'categories' | 'tags';
	title: string;
	description: string;
	posts?: Array<{
		path: string;
		title: string;
		description?: string;
		image?: string;
		categoryText?: string;
	}>;
	totalPosts?: number;
	currentPage?: number;
	postsPerPage?: number;
	hasMorePosts?: boolean;
	isLoading?: boolean;
}>(), {
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

// Breadcrumbs: the section list, then the category or tag
const breadcrumbs = computed(() => [
	props.section === 'tags' ? { label: t('uiVintage.blog.breadcrumbTags'), to: '/blog/tags' } : { label: t('uiVintage.blog.breadcrumbCategories'), to: '/blog/categories' },
	{ label: props.title }
]);

// Number of posts shown under the header
const headerStats = computed(() => [{ icon: News01Icon, value: props.totalPosts, label: t('uiVintage.blog.stats.posts', props.totalPosts) }]);
</script>

<template>
	<div>
		<!-- Breadcrumbs -->
		<BlogPageBreadcrumbs :items="breadcrumbs" />

		<!-- Blog header -->
		<BlogHeaderSection :title="props.title"
			:highlight="props.title"
			:description="props.description"
			:stats="headerStats"
			class="mb-12 md:mb-16" />

		<!-- Posts -->
		<PostsList :posts="props.posts" />

		<!-- Load more button -->
		<LoadMoreButton v-if="props.hasMorePosts" :busy="props.isLoading" :text="t('uiVintage.blog.loadMoreWithNumbers', {
			current: Math.min(props.currentPage * props.postsPerPage, props.totalPosts),
			total: props.totalPosts
		})" @load-more="emit('load-more')" data-aos="blur-up" />
	</div>
</template>