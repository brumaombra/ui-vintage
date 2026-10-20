<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';

// Props (lg is a big standalone key, for example to show a shortcut in a hint)
const props = withDefaults(defineProps<{
	class?: HTMLAttributes['class'];
	pressed?: boolean;
	size?: 'default' | 'lg';
}>(), {
	size: 'default'
});
</script>

<template>
	<kbd data-slot="kbd" :data-pressed="props.pressed ? '' : undefined" :class="cn(
		'inline-flex h-5 min-w-5 select-none items-center justify-center gap-1 rounded border border-b-2 border-border bg-surface px-1.5 font-mono text-[11px] leading-none font-semibold text-muted-foreground shadow-elevated-sm transition-[translate,border-width,box-shadow] duration-100 ease-snappy [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-3',
		'data-pressed:translate-y-px data-pressed:border-b data-pressed:shadow-none',
		props.size === 'lg' && 'h-10 min-w-10 px-3 text-sm',
		props.class
	)
		">
		<slot />
	</kbd>
</template>