<script setup lang="ts">
import { SectionTitle } from '../section-title';

// Props (the blog sections use the shared section title, revealed on scroll)
const props = withDefaults(defineProps<{
	title: string;
	description?: string;
}>(), {
	description: ''
});
</script>

<template>
	<SectionTitle data-aos="blur-up" :title="props.title" :description="props.description">
		<template v-if="$slots.action" #action>
			<slot name="action" />
		</template>
	</SectionTitle>
</template>