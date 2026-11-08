<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { HeadingLevel } from '../../lib/common-types';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';

// Props
const props = withDefaults(defineProps<{
	title?: string;
	hint?: string; // Short note under the group
	/** @default 2 */
	headingLevel?: HeadingLevel; // Of the title: 3 when the group sits under a section title
	class?: HTMLAttributes['class'];
}>(), {
	headingLevel: 2
});
</script>

<template>
	<section data-slot="list-group" :class="cn(props.class)">
		<!-- A group of rows, like the lists of the phone settings: the title, the rows in one card, then a note -->
		<component :is="`h${props.headingLevel}`" v-if="props.title" class="mb-2 px-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">{{ props.title }}</component>

		<!-- Rows -->
		<Card padding="none">
			<ul class="divide-y divide-border">
				<slot />
			</ul>
		</Card>

		<!-- Note (a step smaller on phones, like the rows) -->
		<p v-if="props.hint" class="mt-2 px-1 text-[0.6875rem] text-muted-foreground md:text-xs">{{ props.hint }}</p>
	</section>
</template>