import { h, markRaw, reactive, render } from "vue";
import type { Component } from "vue";

export type DialogMessageType = "error" | "success" | "info" | "warning";

export interface ShowMessageDialogOptions {
    type?: DialogMessageType;
    title?: string;
    message: string;
    closeText?: string;
    icon?: Component | null;
    closeButtonIcon?: Component | null;
}

interface MessageDialogRequest {
    id: number;
    options: Required<Omit<ShowMessageDialogOptions, "icon" | "closeButtonIcon">> & {
        icon: Component | null;
        closeButtonIcon: Component | null;
    };
    resolve: () => void;
}

interface MessageDialogState {
    current: MessageDialogRequest | null;
    busy: boolean;
    isOpen: boolean;
}

const messageDialogQueue: MessageDialogRequest[] = [];
let nextMessageDialogId = 0;
const DIALOG_CLOSE_DURATION_MS = 300;
let closeTimer: ReturnType<typeof setTimeout> | null = null;
let messageDialogMountPromise: Promise<void> | null = null;

const MESSAGE_DIALOG_ROOT_ID = "ui-vintage-message-dialog-root";

// Shared message dialog state
export const messageDialogState: MessageDialogState = reactive({
    current: null,
    busy: false,
    isOpen: false
});

// Keep component icons non-reactive
const markIcon = (icon: Component | null | undefined) => icon ? markRaw(icon) : null;

// Mount the dialog once on demand
const ensureMessageDialogMounted = () => {
    // Skip mounting during SSR
    if (typeof document === "undefined") {
        return Promise.resolve();
    }

    // Reuse the existing mount root
    const existingRoot = document.getElementById(MESSAGE_DIALOG_ROOT_ID);
    if (existingRoot) {
        return Promise.resolve();
    }

    // Reuse the in-flight mount
    if (messageDialogMountPromise) {
        return messageDialogMountPromise;
    }

    // Start the lazy mount
    messageDialogMountPromise = (async () => {
        // Load the component only when needed
        const { default: MessageDialog } = await import("./MessageDialog.vue");

        // Guard against a concurrent mount
        if (document.getElementById(MESSAGE_DIALOG_ROOT_ID)) {
            return;
        }

        // Create the host element and render the component
        const container = document.createElement("div");
        container.id = MESSAGE_DIALOG_ROOT_ID;
        document.body.appendChild(container);
        render(h(MessageDialog), container);
    })().finally(() => {
        messageDialogMountPromise = null;
    });

    // Let callers await the mount
    return messageDialogMountPromise;
};

// Show the next queued dialog
const openNextMessageDialog = () => {
    const nextDialog = messageDialogQueue.shift() ?? null;
    messageDialogState.current = nextDialog;
    messageDialogState.isOpen = Boolean(nextDialog);
};

// Queue a new dialog request
const enqueueMessageDialog = (request: MessageDialogRequest) => {
    messageDialogQueue.push(request);
    if (!messageDialogState.current) {
        openNextMessageDialog();
    }
};

// Clear the active dialog and continue the queue
const clearCurrentMessageDialog = () => {
    messageDialogState.busy = false;
    messageDialogState.isOpen = false;
    messageDialogState.current = null;
    openNextMessageDialog();
};

// Close the current dialog after the leave transition
const scheduleCloseCurrentMessageDialog = () => {
    // Guard against missing or already closing dialogs
    if (!messageDialogState.current || !messageDialogState.isOpen) {
        return;
    }

    // Start the close transition
    messageDialogState.isOpen = false;
    if (closeTimer) {
        clearTimeout(closeTimer);
    }

    // Schedule the dialog to be cleared after the transition
    closeTimer = setTimeout(() => {
        closeTimer = null;
        clearCurrentMessageDialog();
    }, DIALOG_CLOSE_DURATION_MS);
};

// Resolve the dialog as closed
export const closeMessageDialog = () => {
    const current = messageDialogState.current;
    if (!current || !messageDialogState.isOpen) return;
    current.resolve();
    scheduleCloseCurrentMessageDialog();
};

// Resolve the active message dialog
export const resolveActiveMessageDialog = () => {
    const current = messageDialogState.current;
    if (!current || messageDialogState.busy) return;
    current.resolve();
    scheduleCloseCurrentMessageDialog();
};

// Queue and show a message dialog
export const showMessageDialog = (options: ShowMessageDialogOptions) => {
    // Ensure the renderer exists before queuing work
    void ensureMessageDialogMounted();

    // Return a promise that resolves when the dialog is closed
    return new Promise<void>((resolve) => {
        enqueueMessageDialog({
            id: nextMessageDialogId += 1,
            options: {
                type: options.type ?? "info",
                title: options.title ?? "",
                message: options.message,
                closeText: options.closeText ?? "Close",
                icon: markIcon(options.icon),
                closeButtonIcon: markIcon(options.closeButtonIcon)
            },
            resolve
        });
    });
};