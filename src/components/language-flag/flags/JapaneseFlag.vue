<script setup lang="ts">
// Props (size: md next to a label, lg in the 36px space of an icon tile, like the cards of a picker)
const props = withDefaults(defineProps<{
	size?: 'md' | 'lg';
}>(), {
	size: 'md'
});
</script>

<template>
	<svg xmlns="http://www.w3.org/2000/svg" :class="props.size === 'lg' ? 'h-6 w-8 shrink-0 rounded-[3px]' : 'h-4 w-[1.35rem] shrink-0 rounded-[2px]'" viewBox="0 0 640 480" aria-hidden="true" focusable="false">
		<path fill="#fff" d="M0 0h640v480H0z" />
		<circle cx="320" cy="240" r="112" fill="#bc002d" />
	</svg>
</template>