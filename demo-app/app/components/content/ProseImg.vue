<script setup>
// Props
const props = defineProps({
	src: { type: String, required: true },
	alt: { type: String, default: '' },
	title: { type: String, default: '' },
	width: { type: [String, Number], default: 1672 }, // Blog illustrations are 1672x941 (16:9): the size reserves the space before the lazy image loads
	height: { type: [String, Number], default: 941 }
});
</script>

<template>
	<NuxtImg :src="props.src"
		:alt="props.alt"
		:title="props.title"
		:width="props.width"
		:height="props.height"
		format="avif"
		quality="40"
		:sizes="{ 480: '480px', 1536: '896px' }"
		loading="lazy"
		decoding="async"
		data-aos="fade-up"
		class="block w-full rounded my-6 sm:my-8" />
</template>