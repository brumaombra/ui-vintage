<script setup lang="ts">
// Props (size: md next to a label, lg in the 36px space of an icon tile, like the cards of a picker)
const props = withDefaults(defineProps<{
	size?: 'md' | 'lg';
}>(), {
	size: 'md'
});
</script>

<template>
	<svg xmlns="http://www.w3.org/2000/svg" :class="props.size === 'lg' ? 'h-6 w-8 shrink-0 rounded-[3px]' : 'h-4 w-[1.35rem] shrink-0 rounded-[2px]'" viewBox="0 0 5 3" aria-hidden="true" focusable="false">
		<rect width="5" height="1" y="0" fill="#000000" />
		<rect width="5" height="1" y="1" fill="#dd0000" />
		<rect width="5" height="1" y="2" fill="#ffce00" />
	</svg>
</template>