<script setup lang="ts">
import { AlertCircleIcon, Cancel01Icon, CheckmarkCircle02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/vue";
import { computed } from "vue";
import { getUiVintageRuntimeMessage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { closeMessageToast, messageToastState } from "./message-toast-state";

// Current toast data
const currentToast = computed(() => messageToastState.current);

// Localized dismiss label resolved from bundled library messages
const closeAriaLabel = computed(() => getUiVintageRuntimeMessage("uiVintage.buttons.close", "Close"));

// Determine toast type for styling and icon selection
const toastType = computed(() => currentToast.value?.type ?? "success");

// Resolved icon based on toast type
const toastIcon = computed(() => {
    if (toastType.value === "success") return CheckmarkCircle02Icon;
    return toastType.value === "info" ? InformationCircleIcon : AlertCircleIcon;
});

// Resolved icon color classes based on toast type
const toastIconClasses = computed(() => {
    if (toastType.value === "error") return "text-red-600 dark:text-red-400";
    if (toastType.value === "warning") return "text-amber-600 dark:text-amber-400";
    if (toastType.value === "info") return "text-blue-600 dark:text-blue-400";
    return "text-green-600 dark:text-green-400";
});

// Resolved aria-live politeness based on toast type
const toastAriaLive = computed(() => {
    if (toastType.value === "error" || toastType.value === "warning") return "assertive";
    return "polite";
});
</script>

<template>
    <Transition name="toast">
        <div v-if="messageToastState.current && messageToastState.isOpen" class="fixed inset-x-3 bottom-3 z-30 rounded border border-border bg-card p-4 text-card-foreground transition-colors duration-300 ease-in-out sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-[350px] sm:min-w-[250px]" role="alert" :aria-live="toastAriaLive" aria-atomic="true">
            <div class="flex items-center gap-4">
                <!-- Leading type icon -->
                <HugeiconsIcon :icon="toastIcon" class="size-5" :class="toastIconClasses" />

                <!-- Message text -->
                <p class="m-0 flex-1 text-sm font-medium leading-5">
                    {{ currentToast?.message }}
                </p>

                <!-- Dismiss button -->
                <Button variant="ghost" size="icon-sm" class="-me-1 h-auto min-h-0 w-auto p-0 opacity-70 hover:opacity-100" :aria-label="closeAriaLabel" @click="closeMessageToast">
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