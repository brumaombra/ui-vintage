<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue';
import { computed } from 'vue';
import { AlertCircleIcon, InformationCircleIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { getUiVintageRuntimeMessage } from '../../lib/i18n';
import { closeMessageDialog, messageDialogState, resolveActiveMessageDialog } from './message-dialog-state';

// Active dialog state
const currentDialog = computed(() => messageDialogState.current);

// Resolve the title
const resolvedTitle = computed(() => {
    const current = currentDialog.value;
    if (!current) return '';
    return current.options.title || getUiVintageRuntimeMessage(`uiVintage.messageDialog.${current.options.type}`, '');
});

// Resolve the close button text
const resolvedCloseText = computed(() => {
    const current = currentDialog.value;
    if (!current) return getUiVintageRuntimeMessage('uiVintage.buttons.close', 'Close');
    return current.options.closeText || getUiVintageRuntimeMessage('uiVintage.buttons.close', 'Close');
});

// Resolved fallback icon for the current message type
const defaultMessageIcon = computed(() => {
    const current = currentDialog.value;
    if (!current) return InformationCircleIcon;
    if (current.options.type === 'error' || current.options.type === 'warning') return AlertCircleIcon;
    if (current.options.type === 'success') return Tick02Icon;
    return InformationCircleIcon;
});

// Resolved container classes for the message icon
const messageIconClasses = computed(() => {
    const current = currentDialog.value;
    if (!current) return 'border-border bg-surface';
    if (current.options.type === 'error') return 'border-destructive/25 bg-destructive/10';
    if (current.options.type === 'warning') return 'border-warning/25 bg-warning/10';
    if (current.options.type === 'success') return 'border-success/25 bg-success/10';
    return 'border-border bg-surface';
});

// Resolved glyph color classes
const messageGlyphClasses = computed(() => {
    const current = currentDialog.value;
    if (!current) return 'text-info';
    if (current.options.type === 'error') return 'text-destructive';
    if (current.options.type === 'warning') return 'text-warning';
    if (current.options.type === 'success') return 'text-success';
    return 'text-info';
});

// Close the dialog when the shell requests it
const handleOpenChange = (open: boolean) => {
    if (!open) {
        closeMessageDialog();
    }
};
</script>

<template>
    <!-- Dialog shell -->
    <AlertDialog :open="messageDialogState.isOpen" @update:open="handleOpenChange">
        <!-- Dialog content -->
        <AlertDialogContent v-if="currentDialog">
            <div class="px-5 pb-5 pt-5 sm:px-6 sm:pb-4 sm:pt-6">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <!-- Dialog icon -->
                    <div class="flex size-12 shrink-0 self-center items-center justify-center rounded border sm:size-10 sm:self-start" :class="messageIconClasses">
                        <HugeiconsIcon v-if="currentDialog.options.icon" :icon="currentDialog.options.icon" :stroke-width="1.8" class="size-6 animate-uv-pop [animation-delay:140ms]" :class="messageGlyphClasses" />
                        <HugeiconsIcon v-else :icon="defaultMessageIcon" :stroke-width="1.8" class="size-6 animate-uv-pop [animation-delay:140ms]" :class="messageGlyphClasses" />
                    </div>

                    <!-- Dialog header -->
                    <AlertDialogHeader class="sm:pt-0">
                        <!-- Title -->
                        <AlertDialogTitle>
                            {{ resolvedTitle }}
                        </AlertDialogTitle>

                        <!-- Message -->
                        <AlertDialogDescription>
                            {{ currentDialog.options.message }}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </div>
            </div>

            <!-- Dialog actions -->
            <AlertDialogFooter class="items-end">
                <Button variant="secondary" @click="resolveActiveMessageDialog">
                    <HugeiconsIcon v-if="currentDialog.options.closeButtonIcon" :icon="currentDialog.options.closeButtonIcon" class="size-4" />
                    {{ resolvedCloseText }}
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>