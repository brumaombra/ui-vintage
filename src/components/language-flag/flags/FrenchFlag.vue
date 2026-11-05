<script setup lang="ts">
// Props (size: md next to a label, lg in the 36px space of an icon tile, like the cards of a picker)
const props = withDefaults(defineProps<{
	size?: 'md' | 'lg';
}>(), {
	size: 'md'
});
</script>

<template>
	<svg xmlns="http://www.w3.org/2000/svg" :class="props.size === 'lg' ? 'h-6 w-8 shrink-0 rounded-[3px]' : 'h-4 w-[1.35rem] shrink-0 rounded-[2px]'" viewBox="0 0 3 2" aria-hidden="true" focusable="false">
		<rect width="1" height="2" x="0" fill="#002654" />
		<rect width="1" height="2" x="1" fill="#ffffff" />
		<rect width="1" height="2" x="2" fill="#ce1126" />
	</svg>
</template>