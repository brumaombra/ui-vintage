<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue';
import type { HeadingLevel, HugeiconsIconDefinition } from '../../lib/common-types';

// Props (a slim section heading over a thin rule, with an optional icon before the title, description and trailing action)
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
	<div data-slot="section-title" :class="['mb-3 flex gap-3 border-b border-border pb-2 md:mb-5 md:pb-3', props.description ? 'flex-col sm:flex-row sm:items-end sm:justify-between' : 'items-center justify-between']">
		<!-- On phones the space below the heading (its margin) matches the DashboardShell page padding (12px) -->

		<div class="min-w-0">
			<!-- Title, with its icon inline in the brand color -->
			<component :is="`h${props.headingLevel}`" class="flex min-w-0 items-center gap-2 text-base font-semibold tracking-tight text-foreground md:text-lg">
				<HugeiconsIcon v-if="props.icon" :icon="props.icon" class="size-4 shrink-0 text-primary md:size-4.5" :stroke-width="1.8" aria-hidden="true" />
				<span class="min-w-0">{{ props.title }}</span>
			</component>

			<!-- Description -->
			<p v-if="props.description" class="mt-1 max-w-2xl text-xs leading-6 text-muted-foreground md:text-sm">
				{{ props.description }}
			</p>
		</div>

		<!-- Optional trailing action (for example a "View all" link) -->
		<div v-if="$slots.action" class="shrink-0">
			<slot name="action" />
		</div>
	</div>
</template>