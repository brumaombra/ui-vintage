<script setup lang="ts">
import { computed } from 'vue';
import type { HTMLAttributes } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { cn } from '../../../lib/utils';
import type { HeadingLevel, HugeiconsIconDefinition } from '../../../lib/common-types';

// Props
const props = withDefaults(defineProps<{
	class?: HTMLAttributes['class'];
	/** @default 3 */
	headingLevel?: HeadingLevel;
	/** @deprecated Use headingLevel, the same name in every component */
	level?: HeadingLevel;
	icon?: HugeiconsIconDefinition | null;
}>(), {
	icon: null
});

// The heading tag: headingLevel, or the deprecated level, h3 by default
const headingTag = computed(() => `h${props.headingLevel ?? props.level ?? 3}`);
</script>

<template>
	<component :is="headingTag"
		data-slot="card-title"
		:class="cn('leading-none font-semibold text-sm sm:text-base', props.icon && 'flex items-center gap-2', props.class)">
		<!-- Leading icon -->
		<HugeiconsIcon v-if="props.icon" :icon="props.icon" class="size-4 shrink-0" />
		<slot />
	</component>
</template>