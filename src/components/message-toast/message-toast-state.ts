import { h, reactive, render } from "vue";

export type MessageToastStatus = "success" | "info" | "warning" | "error";

export interface ShowMessageToastOptions {
    message: string;
    status?: MessageToastStatus;
    duration?: number;
}

interface MessageToastContent {
    message: string;
    status: MessageToastStatus;
}

interface MessageToastState {
    current: MessageToastContent | null;
    isOpen: boolean;
}

const TOAST_CLOSE_DURATION_MS = 300;
const DEFAULT_TOAST_DURATION_MS = 5000;
const MESSAGE_TOAST_ROOT_ID = "ui-vintage-message-toast-root";

let dismissTimer: ReturnType<typeof setTimeout> | null = null;
let clearTimer: ReturnType<typeof setTimeout> | null = null;
let messageToastMountPromise: Promise<void> | null = null;

// Shared message toast state
export const messageToastState: MessageToastState = reactive({
    current: null,
    isOpen: false
});

// Mount the toast once on demand
const ensureMessageToastMounted = () => {
    // Skip mounting during SSR
    if (typeof document === "undefined") {
        return Promise.resolve();
    }

    // Reuse the existing mount root
    const existingRoot = document.getElementById(MESSAGE_TOAST_ROOT_ID);
    if (existingRoot) {
        return Promise.resolve();
    }

    // Reuse the in-flight mount
    if (messageToastMountPromise) {
        return messageToastMountPromise;
    }

    // Start the lazy mount
    messageToastMountPromise = (async () => {
        // Load the component only when needed
        const { default: MessageToast } = await import("./MessageToast.vue");

        // Guard against a concurrent mount
        if (document.getElementById(MESSAGE_TOAST_ROOT_ID)) {
            return;
        }

        // Create the host element and render the component
        const container = document.createElement("div");
        container.id = MESSAGE_TOAST_ROOT_ID;
        document.body.appendChild(container);
        render(h(MessageToast), container);
    })().finally(() => {
        messageToastMountPromise = null;
    });

    // Let callers await the mount
    return messageToastMountPromise;
};

// Clear active timers before updating toast state
const clearMessageToastTimers = () => {
    // Clear any pending auto-dismiss timer
    if (dismissTimer) {
        clearTimeout(dismissTimer);
        dismissTimer = null;
    }

    // Clear any pending clear timer from a previous toast
    if (clearTimer) {
        clearTimeout(clearTimer);
        clearTimer = null;
    }
};

// Clear the current toast after the leave transition
const clearCurrentMessageToast = () => {
    messageToastState.current = null;
};

// Close the toast after the leave transition
const scheduleCloseMessageToast = () => {
    // Skip if there's no active toast
    if (!messageToastState.current || !messageToastState.isOpen) {
        return;
    }

    // Start the close transition
    messageToastState.isOpen = false;
    clearTimer = setTimeout(() => {
        clearTimer = null;
        clearCurrentMessageToast();
    }, TOAST_CLOSE_DURATION_MS);
};

// Dismiss the active toast
export const closeMessageToast = () => {
    clearMessageToastTimers();
    scheduleCloseMessageToast();
};

// Show a message toast and optionally auto-dismiss it
export const showMessageToast = (options: ShowMessageToastOptions) => {
    void ensureMessageToastMounted();

    // Update the toast state to show the new message
    clearMessageToastTimers();
    messageToastState.current = {
        message: options.message,
        status: options.status ?? "success"
    };

    // Start the open transition
    messageToastState.isOpen = true;

    // Auto-dismiss the toast after the specified duration
    const duration = options.duration ?? DEFAULT_TOAST_DURATION_MS;
    if (duration > 0) {
        dismissTimer = setTimeout(() => {
            dismissTimer = null;
            scheduleCloseMessageToast();
        }, duration);
    }
};