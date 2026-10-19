<script setup lang="ts">
// Props (the path is localized by the link, external URLs work too)
const props = defineProps<{
	to: string;
	text: string;
}>();

// Emits
const emits = defineEmits<{
	click: [event: MouseEvent];
}>();

// Handle click
const handleClick = (event: MouseEvent) => {
	emits('click', event);
};
</script>

<template>
	<NuxtLinkLocale :to="props.to" class="cursor-pointer font-semibold text-foreground hover:underline" @click="handleClick">
		{{ props.text }}
	</NuxtLinkLocale>
</template>