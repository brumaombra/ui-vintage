<script setup lang="ts">
import PostCard from './PostCard.vue';
import type { HeadingLevel } from '../../lib/common-types';

// Props
const props = withDefaults(defineProps<{
	posts?: Array<{
		path: string;
		title: string;
		description?: string;
		image?: string;
		categoryText?: string;
		categoryPath?: string;
	}>;
	/** @default 2 */
	headingLevel?: HeadingLevel; // Of the post titles: 3 when the list sits under a section title
}>(), {
	posts: () => [],
	headingLevel: 2
});
</script>

<template>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		<!-- Post cards rise in as they scroll into view (staggered in on-screen order by the reveal-order plugin) -->
		<NuxtLinkLocale v-for="post in props.posts" :key="post.path" data-aos="blur-up" :to="post.path" class="block h-full rounded outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45">
			<PostCard class="h-full" :image="post.image" :category="post.categoryText" :title="post.title" :description="post.description" :heading-level="props.headingLevel" />
		</NuxtLinkLocale>
	</div>
</template>