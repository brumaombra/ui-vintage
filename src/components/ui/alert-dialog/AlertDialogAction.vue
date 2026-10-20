<script setup lang="ts">
import type { AlertDialogActionProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { AlertDialogAction } from 'reka-ui';
import { cn } from '../../../lib/utils';
import { buttonVariants, type ButtonVariants } from '../button';

// Props (variant styles the action like a Button, for example red for a destructive confirmation)
const props = defineProps<AlertDialogActionProps & { variant?: ButtonVariants['variant']; class?: HTMLAttributes['class'] }>();

// Omit local props from delegated props
const delegatedProps = reactiveOmit(props, 'class', 'variant');
</script>

<template>
	<AlertDialogAction v-bind="delegatedProps" :class="cn(buttonVariants({ variant: props.variant }), props.class)">
		<slot />
	</AlertDialogAction>
</template>