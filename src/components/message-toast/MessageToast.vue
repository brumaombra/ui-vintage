<script setup lang="ts">
import { AlertCircleIcon, Cancel01Icon, CheckmarkCircle02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/vue";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { closeMessageToast, messageToastState } from "./message-toast-state";

// Current toast data
const currentToast = computed(() => messageToastState.current);

// Determine toast status for styling and icon selection
const toastStatus = computed(() => currentToast.value?.status ?? "success");

// Resolved icon based on toast status
const toastIcon = computed(() => {
    if (toastStatus.value === "success") return CheckmarkCircle02Icon;
    return toastStatus.value === "info" ? InformationCircleIcon : AlertCircleIcon;
});

// Resolved icon color classes based on toast status
const toastIconClasses = computed(() => {
    if (toastStatus.value === "error") return "text-red-600 dark:text-red-400";
    if (toastStatus.value === "warning") return "text-amber-600 dark:text-amber-400";
    if (toastStatus.value === "info") return "text-blue-600 dark:text-blue-400";
    return "text-green-600 dark:text-green-400";
});

// Resolved aria-live politeness based on toast status
const toastAriaLive = computed(() => {
    if (toastStatus.value === "error" || toastStatus.value === "warning") return "assertive";
    return "polite";
});
</script>

<template>
    <Transition name="toast">
        <div v-if="messageToastState.current && messageToastState.isOpen" class="fixed inset-x-3 bottom-3 z-30 rounded border border-border bg-card p-4 text-card-foreground transition-colors duration-300 ease-in-out sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-[350px] sm:min-w-[250px]" role="alert" :aria-live="toastAriaLive" aria-atomic="true">
            <div class="flex items-center gap-4">
                <!-- Leading status icon -->
                <HugeiconsIcon :icon="toastIcon" class="size-5" :class="toastIconClasses" />

                <!-- Message text -->
                <p class="m-0 flex-1 text-sm font-medium leading-5">
                    {{ currentToast?.message }}
                </p>

                <!-- Dismiss button -->
                <Button variant="ghost" size="icon-sm" class="-me-1 h-auto min-h-0 w-auto p-0 opacity-70 hover:opacity-100" aria-label="Close" @click="closeMessageToast">
                    <HugeiconsIcon :icon="Cancel01Icon" class="size-4" />
                </Button>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease-in-out;
}

.toast-enter-from {
    transform: translateY(100%);
    opacity: 0;
}

.toast-leave-to {
    transform: translateY(8px);
    opacity: 0;
}
</style>