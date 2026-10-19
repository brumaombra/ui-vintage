<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';

// Props (the trail always starts with Home and Blog, the last item is the current page)
const props = defineProps<{
	items: Array<{
		label: string;
		to?: string;
	}>;
}>();

const { t } = useI18n();

// Full trail of the page
const trail = computed(() => [
	{ label: t('uiVintage.blog.breadcrumbHome'), to: '/' },
	{ label: t('uiVintage.blog.breadcrumbBlog'), to: '/blog' },
	...props.items
]);
</script>

<template>
	<!-- Breadcrumbs of a blog listing page (the paths are localized) -->
	<Breadcrumb class="mb-2 flex animate-uv-fade-up justify-center">
		<BreadcrumbList>
			<template v-for="(item, index) in trail" :key="item.label">
				<BreadcrumbSeparator v-if="index > 0" />
				<BreadcrumbItem>
					<BreadcrumbLink v-if="item.to && index < trail.length - 1" as-child>
						<NuxtLinkLocale :to="item.to">
							{{ item.label }}
						</NuxtLinkLocale>
					</BreadcrumbLink>
					<BreadcrumbPage v-else>
						{{ item.label }}
					</BreadcrumbPage>
				</BreadcrumbItem>
			</template>
		</BreadcrumbList>
	</Breadcrumb>
</template>