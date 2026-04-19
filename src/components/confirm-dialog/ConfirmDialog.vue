<script setup lang="ts">
import { HugeiconsIcon } from "@hugeicons/vue";
import { computed } from "vue";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cancelActiveConfirmDialog, closeConfirmDialog, confirmActiveDialog, confirmDialogState } from "./confirm-dialog-state";

const currentDialog = computed(() => confirmDialogState.current);

// Close the dialog when the shell requests it
const handleOpenChange = (open: boolean) => {
    if (!open) {
        closeConfirmDialog();
    }
};
</script>

<template>
    <!-- Dialog shell -->
    <AlertDialog :open="confirmDialogState.isOpen" @update:open="handleOpenChange">
        <!-- Dialog content -->
        <AlertDialogContent v-if="currentDialog">
            <div class="px-5 pb-5 pt-5 sm:px-6 sm:pb-4 sm:pt-6">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <!-- Dialog icon -->
                    <div class="flex size-12 shrink-0 self-center items-center justify-center rounded border border-[var(--border-light)] bg-[var(--bg-surface-light)] sm:size-10 sm:self-start dark:border-[var(--border-dark)] dark:bg-[var(--bg-surface-dark)]">
                        <HugeiconsIcon v-if="currentDialog.options.icon" :icon="currentDialog.options.icon" :stroke-width="1.8" class="size-6 text-[var(--button-primary-light)] dark:text-[var(--button-primary-dark)]" />
                        <HugeiconsIcon v-else :icon="InformationCircleIcon" :stroke-width="1.8" class="size-6 text-[var(--button-primary-light)] dark:text-[var(--button-primary-dark)]" />
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
            <AlertDialogFooter>
                <!-- Cancel button -->
                <Button :variant="currentDialog.options.cancelButtonType" :disabled="confirmDialogState.busy" @click="cancelActiveConfirmDialog">
                    <HugeiconsIcon v-if="currentDialog.options.cancelButtonIcon" :icon="currentDialog.options.cancelButtonIcon" class="size-4" />
                    {{ currentDialog.options.cancelText }}
                </Button>

                <!-- Confirm button -->
                <Button :variant="currentDialog.options.confirmButtonType" :disabled="confirmDialogState.busy" @click="confirmActiveDialog">
                    <HugeiconsIcon v-if="currentDialog.options.confirmButtonIcon" :icon="currentDialog.options.confirmButtonIcon" class="size-4" />
                    {{ currentDialog.options.confirmText }}
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>