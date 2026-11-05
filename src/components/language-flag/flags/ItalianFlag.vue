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
		<g fill-rule="evenodd" stroke-width="1pt">
			<path fill="#fff" d="M0 0h640v480H0z" />
			<path fill="#009246" d="M0 0h213.3v480H0z" />
			<path fill="#ce2b37" d="M426.7 0H640v480H426.7z" />
		</g>
	</svg>
</template>