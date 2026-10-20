<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue';
import type { HeadingLevel, HugeiconsIconDefinition } from '../../lib/common-types';

// Props (a section heading over a rule that starts with a primary segment, with an optional icon tile, description and trailing action)
const props = withDefaults(defineProps<{
	title: string;
	description?: string;
	icon?: HugeiconsIconDefinition | null;
	headingLevel?: HeadingLevel;
}>(), {
	description: '',
	icon: null,
	headingLevel: 2
});
</script>

<template>
	<div data-slot="section-title" :class="['relative mb-6 flex gap-3 border-b border-border pb-4 md:mb-8', props.description ? 'flex-col sm:flex-row sm:items-end sm:justify-between' : 'items-center justify-between']">
		<!-- Primary segment at the start of the rule -->
		<span aria-hidden="true" class="absolute -bottom-px left-0 h-0.5 w-12 bg-primary" />

		<div class="flex min-w-0 items-center gap-3">
			<!-- Icon tile -->
			<span v-if="props.icon" class="flex size-9 shrink-0 items-center justify-center rounded border border-primary/30 text-primary">
				<HugeiconsIcon :icon="props.icon" class="size-4.5" :stroke-width="1.6" />
			</span>

			<div class="min-w-0">
				<!-- Title -->
				<component :is="`h${props.headingLevel}`" class="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
					{{ props.title }}
				</component>

				<!-- Description -->
				<p v-if="props.description" class="mt-1 max-w-2xl text-xs leading-6 text-muted-foreground md:text-sm">
					{{ props.description }}
				</p>
			</div>
		</div>

		<!-- Optional trailing action (for example a "View all" link) -->
		<div v-if="$slots.action" class="shrink-0">
			<slot name="action" />
		</div>
	</div>
</template>