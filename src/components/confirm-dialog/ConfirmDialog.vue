<script setup lang="ts">
import { computed } from "vue";
import { Info } from "lucide-vue-next";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cancelActiveConfirmDialog, closeConfirmDialog, confirmActiveDialog, confirmDialogState } from "./confirm-dialog-state";

const currentDialog = computed(() => confirmDialogState.current);
const confirmIcon = computed(() => currentDialog.value?.options.icon ?? Info);

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
                        <component :is="confirmIcon" :stroke-width="1.8" class="size-6 text-[var(--button-primary-light)] dark:text-[var(--button-primary-dark)]" />
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
                    <component :is="currentDialog.options.cancelButtonIcon" v-if="currentDialog.options.cancelButtonIcon" class="size-4" />
                    {{ currentDialog.options.cancelText }}
                </Button>

                <!-- Confirm button -->
                <Button :variant="currentDialog.options.confirmButtonType" :disabled="confirmDialogState.busy" @click="confirmActiveDialog">
                    <component :is="currentDialog.options.confirmButtonIcon" v-if="currentDialog.options.confirmButtonIcon" class="size-4" />
                    {{ currentDialog.options.confirmText }}
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>