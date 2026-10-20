<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { cn } from '../../../lib/utils';
import type { HeadingLevel, HugeiconsIconDefinition } from '../../../lib/common-types';

// Props
const props = withDefaults(defineProps<{
	class?: HTMLAttributes['class'];
	level?: HeadingLevel;
	icon?: HugeiconsIconDefinition | null;
}>(), {
	level: 3,
	icon: null
});
</script>

<template>
	<component :is="`h${props.level}`"
		data-slot="card-title"
		:class="cn('leading-none font-semibold text-sm sm:text-base', props.icon && 'flex items-center gap-2', props.class)">
		<!-- Leading icon -->
		<HugeiconsIcon v-if="props.icon" :icon="props.icon" class="size-4 shrink-0" />
		<slot />
	</component>
</template>