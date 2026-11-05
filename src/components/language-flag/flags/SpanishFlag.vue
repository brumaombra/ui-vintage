<script setup lang="ts">
// Props (size: md next to a label, lg in the 36px space of an icon tile, like the cards of a picker)
const props = withDefaults(defineProps<{
	size?: 'md' | 'lg';
}>(), {
	size: 'md'
});
</script>

<template>
	<svg xmlns="http://www.w3.org/2000/svg" :class="props.size === 'lg' ? 'h-6 w-8 shrink-0 rounded-[3px]' : 'h-4 w-[1.35rem] shrink-0 rounded-[2px]'" viewBox="0 0 750 500" aria-hidden="true" focusable="false">
		<rect width="750" height="500" fill="#c60b1e" />
		<rect y="125" width="750" height="250" fill="#ffc400" />
	</svg>
</template>