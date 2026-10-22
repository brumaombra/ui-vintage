<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Idea01Icon from '@hugeicons/core-free-icons/Idea01Icon';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card } from '../ui/card';

// Props (the short answer of the post, from the summary field of its frontmatter)
const props = defineProps<{
	summary: string;
}>();

const { t } = useI18n();
</script>

<template>
	<Card data-slot="blog-summary" role="region" padding="none" class="mb-6" :aria-label="t('uiVintage.blog.inShort')">
		<!-- Header (same layout as the table of contents accordion) -->
		<div class="flex items-center gap-3 px-5 py-3.5">
			<!-- Icon tile -->
			<span class="flex size-7 shrink-0 items-center justify-center rounded border border-primary/30 text-primary">
				<HugeiconsIcon :icon="Idea01Icon" class="size-3.5" />
			</span>

			<!-- Label -->
			<p class="text-sm font-semibold text-foreground">{{ t('uiVintage.blog.inShort') }}</p>
		</div>

		<!-- Summary (same size and line height as the article body text) -->
		<p class="border-t border-border px-5 py-4 text-[14px] leading-[1.8] text-foreground sm:text-[15px] sm:leading-[1.85]">{{ props.summary }}</p>
	</Card>
</template>
