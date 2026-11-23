<script setup lang="ts">
import type { CheckboxGroupRootEmits, CheckboxGroupRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { CheckboxGroupRoot, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<CheckboxGroupRootProps & {
	class?: HTMLAttributes['class'];
}>();

// Emits
const emits = defineEmits<CheckboxGroupRootEmits>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
	<CheckboxGroupRoot data-slot="checkbox-group" v-bind="forwarded" :class="cn(
		'grid gap-3 has-[>[data-slot=checkbox-card]]:gap-2',
		props.class
	)">
		<slot />
	</CheckboxGroupRoot>
</template>