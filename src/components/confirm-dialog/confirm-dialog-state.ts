import { h, markRaw, reactive, render } from "vue";
import type { ButtonVariants } from "@/components/ui/button";

export type DialogButtonVariant = NonNullable<ButtonVariants["variant"]>;
export type HugeiconsIconDefinition = readonly (readonly [string, { readonly [key: string]: string | number }])[];

export interface ShowConfirmDialogOptions {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonType?: DialogButtonVariant;
    cancelButtonType?: DialogButtonVariant;
    icon?: HugeiconsIconDefinition | null;
    confirmButtonIcon?: HugeiconsIconDefinition | null;
    cancelButtonIcon?: HugeiconsIconDefinition | null;
    onConfirm?: (() => void | Promise<void>) | null;
    onCancel?: (() => void | Promise<void>) | null;
}

interface ConfirmDialogRequest {
    id: number;
    options: Required<Omit<ShowConfirmDialogOptions, "icon" | "confirmButtonIcon" | "cancelButtonIcon" | "onConfirm" | "onCancel">> & {
        icon: HugeiconsIconDefinition | null;
        confirmButtonIcon: HugeiconsIconDefinition | null;
        cancelButtonIcon: HugeiconsIconDefinition | null;
        onConfirm: (() => void | Promise<void>) | null;
        onCancel: (() => void | Promise<void>) | null;
    };
    resolve: (value: boolean) => void;
}

interface ConfirmDialogState {
    current: ConfirmDialogRequest | null;
    busy: boolean;
    isOpen: boolean;
}

const confirmDialogQueue: ConfirmDialogRequest[] = [];
let nextConfirmDialogId = 0;
const DIALOG_CLOSE_DURATION_MS = 300;
let closeTimer: ReturnType<typeof setTimeout> | null = null;
let confirmDialogMountPromise: Promise<void> | null = null;

const CONFIRM_DIALOG_ROOT_ID = "ui-vintage-confirm-dialog-root";

// Shared confirm dialog state
export const confirmDialogState: ConfirmDialogState = reactive({
    current: null,
    busy: false,
    isOpen: false
});

// Keep icon definitions non-reactive
const markIcon = (icon: HugeiconsIconDefinition | null | undefined) => icon ? markRaw(icon) : null;

// Mount the dialog once on demand
const ensureConfirmDialogMounted = () => {
    // Skip mounting during SSR
    if (typeof document === "undefined") {
        return Promise.resolve();
    }

    // Reuse the existing mount root
    const existingRoot = document.getElementById(CONFIRM_DIALOG_ROOT_ID);
    if (existingRoot) {
        return Promise.resolve();
    }

    // Reuse the in-flight mount
    if (confirmDialogMountPromise) {
        return confirmDialogMountPromise;
    }

    // Start the lazy mount
    confirmDialogMountPromise = (async () => {
        // Load the component only when needed
        const { default: ConfirmDialog } = await import("./ConfirmDialog.vue");

        // Guard against a concurrent mount
        if (document.getElementById(CONFIRM_DIALOG_ROOT_ID)) {
            return;
        }

        // Create the host element and render the component
        const container = document.createElement("div");
        container.id = CONFIRM_DIALOG_ROOT_ID;
        document.body.appendChild(container);
        render(h(ConfirmDialog), container);
    })().finally(() => {
        confirmDialogMountPromise = null;
    });

    // Let callers await the mount
    return confirmDialogMountPromise;
};

// Show the next queued dialog
const openNextConfirmDialog = () => {
    const nextDialog = confirmDialogQueue.shift() ?? null;
    confirmDialogState.current = nextDialog;
    confirmDialogState.isOpen = Boolean(nextDialog);
};

// Queue a new dialog request
const enqueueConfirmDialog = (request: ConfirmDialogRequest) => {
    confirmDialogQueue.push(request);
    if (!confirmDialogState.current) {
        openNextConfirmDialog();
    }
};

// Clear the active dialog and continue the queue
const clearCurrentConfirmDialog = () => {
    confirmDialogState.busy = false;
    confirmDialogState.isOpen = false;
    confirmDialogState.current = null;
    openNextConfirmDialog();
};

// Close the current dialog after the leave transition
const scheduleCloseCurrentConfirmDialog = () => {
    // Guard against missing or already closed dialogs
    if (!confirmDialogState.current || !confirmDialogState.isOpen) return;
    confirmDialogState.isOpen = false;

    // Clear any existing close timer to avoid racing conditions
    if (closeTimer) {
        clearTimeout(closeTimer);
    }

    // Schedule the dialog to be cleared after the leave transition
    closeTimer = setTimeout(() => {
        closeTimer = null;
        clearCurrentConfirmDialog();
    }, DIALOG_CLOSE_DURATION_MS);
};

// Resolve the dialog as cancelled
export const closeConfirmDialog = () => {
    const current = confirmDialogState.current;
    if (!current || !confirmDialogState.isOpen) return;
    current.resolve(false);
    scheduleCloseCurrentConfirmDialog();
};

// Run the cancel handler for the active dialog
export const cancelActiveConfirmDialog = async () => {
    const current = confirmDialogState.current;
    if (!current || confirmDialogState.busy) return;
    confirmDialogState.busy = true;

    try {
        await current.options.onCancel?.();
        current.resolve(false);
    } finally {
        scheduleCloseCurrentConfirmDialog();
    }
};

// Run the confirm handler for the active dialog
export const confirmActiveDialog = async () => {
    const current = confirmDialogState.current;
    if (!current || confirmDialogState.busy) return;
    confirmDialogState.busy = true;

    try {
        await current.options.onConfirm?.();
        current.resolve(true);
    } finally {
        scheduleCloseCurrentConfirmDialog();
    }
};

// Queue and show a confirm dialog
export const showConfirmDialog = (options: ShowConfirmDialogOptions) => {
    // Ensure the renderer exists before queuing work
    void ensureConfirmDialogMounted();

    // Return a promise that resolves with the user's choice
    return new Promise<boolean>((resolve) => {
        enqueueConfirmDialog({
            id: nextConfirmDialogId += 1,
            options: {
                title: options.title ?? "Confirm",
                message: options.message,
                confirmText: options.confirmText ?? "Confirm",
                cancelText: options.cancelText ?? "Cancel",
                confirmButtonType: options.confirmButtonType ?? "default",
                cancelButtonType: options.cancelButtonType ?? "outline",
                icon: markIcon(options.icon),
                confirmButtonIcon: markIcon(options.confirmButtonIcon),
                cancelButtonIcon: markIcon(options.cancelButtonIcon),
                onConfirm: options.onConfirm ?? null,
                onCancel: options.onCancel ?? null
            },
            resolve
        });
    });
};