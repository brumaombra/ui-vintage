<script setup lang="ts">
import ArrowRight01Icon from '@hugeicons/core-free-icons/ArrowRight01Icon';
import { HugeiconsIcon } from '@hugeicons/vue';

// Props
const props = defineProps<{
	to: string;
	label: string;
}>();
</script>

<template>
	<!-- Link to the full list of a blog section (the path is localized) -->
	<NuxtLinkLocale :to="props.to" class="group/view inline-flex items-center gap-1.5 rounded px-1 text-xs font-semibold text-primary outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45 sm:text-sm">
		{{ props.label }}
		<HugeiconsIcon :icon="ArrowRight01Icon" class="size-4 transition-[translate] duration-300 ease-spring group-hover/view:translate-x-1" />
	</NuxtLinkLocale>
</template>