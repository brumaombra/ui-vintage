<script setup lang="ts">
import type { AlertDialogContentEmits, AlertDialogContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { AlertDialogContent, AlertDialogOverlay, AlertDialogPortal, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Keep attrs on the dialog content element
defineOptions({
	inheritAttrs: false
});

// Props
const props = defineProps<AlertDialogContentProps & { class?: HTMLAttributes['class'] }>();

// Emits
const emits = defineEmits<AlertDialogContentEmits>();

// Omit local class from delegated props
const delegatedProps = reactiveOmit(props, 'class');

// Forward props and emits
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
	<AlertDialogPortal>
		<AlertDialogOverlay data-slot="alert-dialog-overlay" class="uv-overlay-motion fixed inset-0 z-50 bg-black/40 backdrop-blur-[3px] dark:bg-black/60" />
		<!-- A dialog in the middle, and on phones an action sheet from the bottom (full width, sliding up like the other sheets) -->
		<AlertDialogContent data-slot="alert-dialog-content" v-bind="{ ...$attrs, ...forwarded }" :class="cn(
			'uv-modal-motion bg-card text-card-foreground fixed top-[50%] left-[50%] z-50 grid w-[95%] max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-0 overflow-hidden rounded border border-border shadow-elevated-xl sm:max-w-lg',
			'max-sm:top-auto max-sm:bottom-0 max-sm:left-0 max-sm:w-full max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none max-sm:rounded-t-lg max-sm:border-x-0 max-sm:border-b-0',
			'max-sm:data-[state=open]:[animation:uv-sheet-in-bottom_480ms_var(--ease-out-expo)_both]! max-sm:data-[state=closed]:[animation:uv-sheet-out-bottom_200ms_var(--ease-snappy)_both]!',
			props.class
		)">
			<slot />
		</AlertDialogContent>
	</AlertDialogPortal>
</template>