<script setup>
import { ProseImg as UiVintageProseImg } from '@brumaombra/ui-vintage/content';

// Props (other images pass their own size, and the attributes of the markdown image, like a max-height style, reach the library image)
const props = defineProps({
	src: { type: String, required: true },
	alt: { type: String, default: '' },
	title: { type: String, default: '' },
	width: { type: [String, Number], default: 1672 }, // Blog illustrations are 1672x941 (16:9): the size reserves the space before the lazy image loads
	height: { type: [String, Number], default: 941 }
});
</script>

<template>
	<UiVintageProseImg :src="props.src"
		:alt="props.alt"
		:title="props.title"
		:width="props.width"
		:height="props.height" />
</template>