<script setup lang="ts">
import type { TabsContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { ref, watch } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { injectTabsRootContext, TabsContent } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props (boxed frames the panel in a bordered surface)
const props = withDefaults(defineProps<TabsContentProps & {
	variant?: 'plain' | 'boxed';
	class?: HTMLAttributes['class'];
}>(), {
	variant: 'plain'
});

const delegatedProps = reactiveOmit(props, 'class', 'variant');
const rootContext = injectTabsRootContext();

// Fade in only when shown by a tab switch, not with the page (every navigation played it once)
const isAnimated = ref(false);
watch(rootContext.modelValue, () => {
	isAnimated.value = true;
});
</script>

<template>
	<TabsContent data-slot="tabs-content" :class="cn('flex-1 outline-none', isAnimated && 'data-[state=active]:animate-uv-fade-up', props.variant === 'boxed' && 'rounded border border-border bg-surface/50 p-4', props.class)" v-bind="delegatedProps">
		<slot />
	</TabsContent>
</template>