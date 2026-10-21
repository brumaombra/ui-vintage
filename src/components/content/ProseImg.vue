<script setup lang="ts">
import { NuxtImg } from '#components';
import { computed, useAttrs } from 'vue';

// Props (blog illustrations are 1672x941, 16:9: other images pass their own size, e.g. ![Alt](/image.jpg){width="1079" height="1438"})
const props = withDefaults(defineProps<{
	src: string;
	alt?: string;
	title?: string;
	width?: string | number;
	height?: string | number;
}>(), {
	alt: '',
	title: '',
	width: 1672,
	height: 941
});

const attrs = useAttrs();

// Read the max-height in pixels of a style, written as text by hand or received as an object (Nuxt Content passes the style of a markdown image as an object)
const readMaxHeight = (style: unknown): number => {
	if (!style) return NaN;
	if (typeof style === 'string') return Number(style.match(/max-height:\s*(\d+(?:\.\d+)?)px/)?.[1]);
	if (Array.isArray(style)) return style.map(readMaxHeight).find(value => !Number.isNaN(value)) ?? NaN;
	const value = (style as Record<string, unknown>)['max-height'] ?? (style as Record<string, unknown>).maxHeight;
	return Number(String(value ?? '').match(/^(\d+(?:\.\d+)?)px$/)?.[1]);
};

// Size of the image box: the image's own aspect ratio, as wide as the column allows (and narrower when the post caps its height, e.g. style="max-height: 400px"),
// so the frame of the prose images always hugs the picture (a full-width box with a tall picture letterboxed inside showed a frame that did not match it), and the space is reserved before the lazy image loads
const boxStyle = computed(() => {
	const width = Number(props.width) || 1672;
	const height = Number(props.height) || 941;
	const maxHeight = readMaxHeight(attrs.style);
	return {
		aspectRatio: `${width} / ${height}`,
		width: maxHeight ? `${Math.round((maxHeight * width) / height)}px` : '100%', // max-w-full keeps it inside the column
		height: 'auto'
	};
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
		:style="boxStyle"
		class="mx-auto my-6 block max-w-full rounded sm:my-8" />
</template>