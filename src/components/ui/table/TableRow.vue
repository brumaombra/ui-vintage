<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';

// Props (static rows don't highlight on hover, interactive rows show a pointer for clickable rows; data-state="selected" highlights a row with a soft primary tint)
const props = withDefaults(defineProps<{
	static?: boolean;
	interactive?: boolean;
	class?: HTMLAttributes['class'];
}>(), {
	static: false,
	interactive: false
});
</script>

<template>
	<tr data-slot="table-row" :class="cn(
		'data-[state=selected]:bg-primary/5 data-[state=selected]:hover:bg-primary/10 border-b border-border transition-colors',
		!props.static && 'hover:bg-muted/50',
		props.interactive && 'cursor-pointer',
		props.class
	)
		">
		<slot />
	</tr>
</template>