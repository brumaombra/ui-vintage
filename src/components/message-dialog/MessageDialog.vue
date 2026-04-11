<script setup lang="ts">
import { HugeiconsIcon } from "@hugeicons/vue";
import { computed } from "vue";
import { AlertCircleIcon, InformationCircleIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { closeMessageDialog, messageDialogState, resolveActiveMessageDialog } from "./message-dialog-state";

// Active dialog state
const currentDialog = computed(() => messageDialogState.current);

// Resolved fallback icon for the current message type
const defaultMessageIcon = computed(() => {
    const current = currentDialog.value;
    if (!current) return InformationCircleIcon;
    if (current.options.type === "Error") return AlertCircleIcon;
    if (current.options.type === "Success") return Tick02Icon;
    return InformationCircleIcon;
});

// Resolved container classes for the message icon
const messageIconClasses = computed(() => {
    const current = currentDialog.value;
    if (!current) return "border-[var(--border)] bg-[var(--bg-surface-light)] dark:bg-[var(--bg-surface-dark)]";
    if (current.options.type === "Error") return "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30";
    if (current.options.type === "Success") return "border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/30";
    return "border-[var(--border)] bg-[var(--bg-surface-light)] dark:bg-[var(--bg-surface-dark)]";
});

// Resolved glyph color classes
const messageGlyphClasses = computed(() => {
    const current = currentDialog.value;
    if (!current) return "text-blue-600";
    if (current.options.type === "Error") return "text-red-600";
    if (current.options.type === "Success") return "text-green-600";
    return "text-blue-600";
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
                        <component :is="currentDialog.options.icon" v-if="currentDialog.options.icon" :stroke-width="1.8" class="size-6" :class="messageGlyphClasses" />
                        <HugeiconsIcon v-else :icon="defaultMessageIcon" :stroke-width="1.8" class="size-6" :class="messageGlyphClasses" />
                    </div>

                    <!-- Dialog header -->
                    <AlertDialogHeader class="sm:pt-0">
                        <AlertDialogTitle>
                            {{ currentDialog.options.title }}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {{ currentDialog.options.message }}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </div>
            </div>

            <!-- Dialog actions -->
            <AlertDialogFooter class="items-end">
                <Button variant="outline" :disabled="messageDialogState.busy" @click="resolveActiveMessageDialog">
                    <component :is="currentDialog.options.closeButtonIcon" v-if="currentDialog.options.closeButtonIcon" class="size-4" />
                    {{ currentDialog.options.closeText }}
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>