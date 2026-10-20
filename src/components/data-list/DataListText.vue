<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../lib/utils';

// Props (long text is clamped to 3 lines, wrap shows all of it, keeping its line breaks)
const props = withDefaults(defineProps<{
	wrap?: boolean;
	class?: HTMLAttributes['class'];
}>(), {
	wrap: false
});
</script>

<template>
	<div data-slot="data-list-text" :class="cn(props.wrap ? 'whitespace-pre-wrap break-words' : 'line-clamp-3', props.class)">
		<slot />
	</div>
</template>