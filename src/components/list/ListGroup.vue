<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';

// Props
const props = defineProps<{
	title?: string;
	hint?: string; // Short note under the group
	class?: HTMLAttributes['class'];
}>();
</script>

<template>
	<section data-slot="list-group" :class="cn(props.class)">
		<!-- A group of rows, like the lists of the phone settings: the title, the rows in one card, then a note -->
		<h2 v-if="props.title" class="mb-2 px-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">{{ props.title }}</h2>

		<!-- Rows -->
		<Card padding="none">
			<ul class="divide-y divide-border">
				<slot />
			</ul>
		</Card>

		<!-- Note -->
		<p v-if="props.hint" class="mt-2 px-1 text-xs text-muted-foreground">{{ props.hint }}</p>
	</section>
</template>