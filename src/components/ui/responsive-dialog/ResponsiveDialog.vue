<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed, useAttrs } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui';
import Cancel01Icon from '@hugeicons/core-free-icons/Cancel01Icon';
import { HugeiconsIcon } from '@hugeicons/vue';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';
import { Button } from '../button';
import { dialogSizeClasses, type DialogSize } from '../dialog';

// Shape of the dialog: a sheet from the bottom on phones, and a centered dialog or a side panel on larger screens
export type ResponsiveDialogMode = 'sheet' | 'dialog' | 'panel';

defineOptions({
	inheritAttrs: false
});

// Props (desktop: the shape from the md breakpoint up, a centered dialog for short content or a panel on the right for long content)
const props = withDefaults(defineProps<{
	open?: boolean;
	title: string;
	description?: string;
	hideDescription?: boolean;
	desktop?: 'dialog' | 'panel';
	size?: DialogSize;
	showCloseButton?: boolean;
	closeLabel?: string;
	class?: HTMLAttributes['class'];
	bodyClass?: HTMLAttributes['class'];
	footerClass?: HTMLAttributes['class'];
}>(), {
	open: false,
	description: '',
	hideDescription: false,
	desktop: 'dialog',
	size: 'sm',
	showCloseButton: true
});

// Emits
const emits = defineEmits<{
	(e: 'update:open', value: boolean): void;
}>();

const { t } = useI18n();

// The shape for the screen (the server renders the phone one: the dialog opens on a tap, once the screen size is known)
const isWideScreen = useMediaQuery('(min-width: 768px)');
const mode = computed<ResponsiveDialogMode>(() => (isWideScreen.value ? props.desktop : 'sheet'));

// Label of the close button
const resolvedCloseLabel = computed(() => props.closeLabel || t('uiVintage.buttons.close'));

// Classes of each shape (the sheet and the panel slide in from their edge, the dialog grows in the middle)
const modeClasses: Record<ResponsiveDialogMode, string> = {
	sheet: 'inset-x-0 bottom-0 max-h-[92dvh] rounded-t-lg border-t border-border bg-background [animation-fill-mode:both] data-[state=open]:[animation-name:uv-sheet-in-bottom] data-[state=open]:[animation-duration:480ms] data-[state=open]:[animation-timing-function:var(--ease-out-expo)] data-[state=closed]:[animation-name:uv-sheet-out-bottom] data-[state=closed]:[animation-duration:200ms] data-[state=closed]:[animation-timing-function:var(--ease-snappy)]',
	panel: 'inset-y-0 right-0 h-full w-full border-l border-border bg-background sm:max-w-md [animation-fill-mode:both] data-[state=open]:[animation-name:uv-sheet-in-right] data-[state=open]:[animation-duration:480ms] data-[state=open]:[animation-timing-function:var(--ease-out-expo)] data-[state=closed]:[animation-name:uv-sheet-out-right] data-[state=closed]:[animation-duration:200ms] data-[state=closed]:[animation-timing-function:var(--ease-snappy)]',
	dialog: 'uv-modal-motion top-[50%] left-[50%] max-h-[85dvh] w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded border border-border bg-card text-card-foreground'
};
const contentClass = computed(() => cn('fixed z-50 flex flex-col shadow-elevated-xl outline-none', modeClasses[mode.value], mode.value === 'dialog' && dialogSizeClasses[props.size], props.class));

// Classes of the footer: buttons full width and stacked in the sheet and the panel, side by side on the right in the dialog (the main action, first in the slot, on top on phones and rightmost in the dialog)
const footerClasses = computed(() => cn(
	'flex shrink-0 gap-2 border-t border-border px-4 py-3',
	mode.value === 'dialog' ? 'flex-row-reverse justify-start' : 'flex-col',
	mode.value === 'sheet' && 'pb-[calc(0.75rem+env(safe-area-inset-bottom))]',
	props.footerClass
));

// Attributes of the dialog (without a description it describes nothing, which also tells Reka UI the description is left out on purpose)
const attrs = useAttrs();
const contentAttrs = computed(() => (props.description ? attrs : { ...attrs, 'aria-describedby': undefined }));

// Move the focus to the dialog itself, not its first field (on phones that would open the keyboard over the content)
const handleOpenAutoFocus = (event: Event) => {
	event.preventDefault();
	(event.currentTarget as HTMLElement | null)?.focus({ preventScroll: true });
};

// Tell the parent the dialog was opened or closed
const handleOpenChange = (value: boolean) => {
	emits('update:open', value);
};
</script>

<template>
	<DialogRoot :open="props.open" @update:open="handleOpenChange">
		<DialogPortal>
			<!-- Dimmed page behind -->
			<DialogOverlay data-slot="responsive-dialog-overlay" class="uv-overlay-motion fixed inset-0 isolate z-50 bg-black/40 backdrop-blur-[3px] dark:bg-black/60" />

			<!-- The dialog: header, content that scrolls, footer that stays in view -->
			<DialogContent data-slot="responsive-dialog" :data-mode="mode" tabindex="-1" :class="contentClass" v-bind="contentAttrs" @open-auto-focus="handleOpenAutoFocus">
				<!-- Header: the title, extra actions and close -->
				<div data-slot="responsive-dialog-header" class="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
					<DialogTitle data-slot="responsive-dialog-title" class="min-w-0 truncate text-base font-semibold text-foreground">{{ props.title }}</DialogTitle>
					<div class="flex shrink-0 items-center gap-1">
						<slot name="header-actions" :mode="mode" />
						<DialogClose v-if="props.showCloseButton" as-child>
							<Button variant="ghost" size="icon-sm" :aria-label="resolvedCloseLabel">
								<HugeiconsIcon :icon="Cancel01Icon" class="size-4" aria-hidden="true" />
							</Button>
						</DialogClose>
					</div>
				</div>

				<!-- Content -->
				<div data-slot="responsive-dialog-body" :class="cn('min-h-0 flex-1 overflow-y-auto p-4', props.bodyClass)">
					<DialogDescription v-if="props.description" data-slot="responsive-dialog-description" :class="props.hideDescription ? 'sr-only' : 'mb-4 text-sm text-muted-foreground'">{{ props.description }}</DialogDescription>
					<slot :mode="mode" />
				</div>

				<!-- Footer (always in view) -->
				<div v-if="$slots.footer" data-slot="responsive-dialog-footer" :class="footerClasses">
					<slot name="footer" :mode="mode" />
				</div>
			</DialogContent>
		</DialogPortal>
	</DialogRoot>
</template>