<script setup lang="ts">
import { NuxtImg } from '#components';
import { computed } from 'vue';
import type { HTMLAttributes } from 'vue';

// Internal: the app logo of the shells, navbar and footer
const props = withDefaults(defineProps<{
	src: string;
	alt: string;
	size: number;
	sizes?: Record<number, string>;
	loading?: 'eager' | 'lazy';
	fetchpriority?: 'high' | 'low' | 'auto';
	class?: HTMLAttributes['class'];
}>(), {
	loading: 'lazy'
});

// SVG logos skip the image resizer: a vector needs no resized copies, and the prerendered /_ipx copies are served as text/plain by the Node server (so browsers don't show them)
const isSvg = computed(() => /\.svg(?:[?#].*)?$/i.test(props.src));
</script>

<template>
	<img v-if="isSvg" :src="props.src" :alt="props.alt" :width="props.size" :height="props.size" :loading="props.loading" :fetchpriority="props.fetchpriority" decoding="async" :class="props.class" />
	<NuxtImg v-else :src="props.src" :alt="props.alt" :width="props.size" :height="props.size" :sizes="props.sizes" :loading="props.loading" :fetchpriority="props.fetchpriority" decoding="async" :class="props.class" />
</template>