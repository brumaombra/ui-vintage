<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import FolderLibraryIcon from '@hugeicons/core-free-icons/FolderLibraryIcon';
import News01Icon from '@hugeicons/core-free-icons/News01Icon';
import type { BlogCategoryData } from './blogPageUtils';
import BlogHeaderSection from './BlogHeaderSection.vue';
import BlogPageBreadcrumbs from './BlogPageBreadcrumbs.vue';
import CategoriesList from './CategoriesList.vue';

// Props
const props = withDefaults(defineProps<{
	description: string;
	categories?: BlogCategoryData[];
}>(), {
	categories: () => []
});

const { t } = useI18n();

// Category totals shown under the header
const headerStats = computed(() => {
	const postCount = props.categories.reduce((total, category) => total + category.count, 0);
	return [
		{ icon: FolderLibraryIcon, value: props.categories.length, label: t('uiVintage.blog.stats.categories', props.categories.length) },
		{ icon: News01Icon, value: postCount, label: t('uiVintage.blog.stats.posts', postCount) }
	];
});
</script>

<template>
	<div>
		<!-- Breadcrumbs -->
		<BlogPageBreadcrumbs :items="[{ label: t('uiVintage.blog.breadcrumbCategories') }]" />

		<!-- Blog header -->
		<BlogHeaderSection :title="t('uiVintage.blog.categories')"
			:highlight="t('uiVintage.blog.categories')"
			:description="props.description"
			:stats="headerStats"
			class="mb-12 md:mb-16" />

		<!-- Categories section -->
		<CategoriesList :categories="props.categories" />
	</div>
</template>