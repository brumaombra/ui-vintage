<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import News01Icon from '@hugeicons/core-free-icons/News01Icon';
import Tag01Icon from '@hugeicons/core-free-icons/Tag01Icon';
import type { BlogTagData } from './blogPageUtils';
import BlogHeaderSection from './BlogHeaderSection.vue';
import BlogPageBreadcrumbs from './BlogPageBreadcrumbs.vue';
import BlogTagsSection from './BlogTagsSection.vue';

// Props
const props = withDefaults(defineProps<{
	description: string;
	tags?: BlogTagData[];
}>(), {
	tags: () => []
});

const { t } = useI18n();

// Tag totals shown under the header
const headerStats = computed(() => {
	const tagUses = props.tags.reduce((total, tag) => total + (tag.count || 0), 0);
	return [
		{ icon: Tag01Icon, value: props.tags.length, label: t('uiVintage.blog.stats.tags', props.tags.length) },
		{ icon: News01Icon, value: tagUses, label: t('uiVintage.blog.stats.uses', tagUses) }
	];
});
</script>

<template>
	<div>
		<!-- Breadcrumbs -->
		<BlogPageBreadcrumbs :items="[{ label: t('uiVintage.blog.breadcrumbTags') }]" />

		<!-- Blog header -->
		<BlogHeaderSection :title="t('uiVintage.blog.tags')"
			:highlight="t('uiVintage.blog.tags')"
			:description="props.description"
			:stats="headerStats"
			class="mb-12 md:mb-16" />

		<!-- Tags list -->
		<BlogTagsSection :tags="props.tags" class="justify-center" />
	</div>
</template>