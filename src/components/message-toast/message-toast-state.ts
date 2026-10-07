import { h, markRaw, reactive, render } from 'vue';
import type { HugeiconsIconDefinition } from '../../lib/common-types';

export type MessageToastType = 'success' | 'info' | 'warning' | 'error';

export interface MessageToastAction {
    label: string;
    onClick: () => void | Promise<void>;
}

export interface ShowMessageToastOptions {
    message: string;
    type?: MessageToastType;
    duration?: number;
    title?: string;
    icon?: HugeiconsIconDefinition | null;
    action?: MessageToastAction | null;
    dismissible?: boolean;
}

export interface MessageToastItem {
    id: number;
    message: string;
    type: MessageToastType;
    title: string;
    icon: HugeiconsIconDefinition | null;
    action: MessageToastAction | null;
    dismissible: boolean;
    duration: number;
}

interface MessageToastContent {
    message: string;
    type: MessageToastType;
}

interface MessageToastState {
    current: MessageToastContent | null;
    isOpen: boolean;
    toasts: MessageToastItem[];
    paused: boolean;
}

interface ToastTimer {
    handle: ReturnType<typeof setTimeout> | null;
    remaining: number;
    startedAt: number;
}

const DEFAULT_TOAST_DURATION_MS = 5000;
const MAX_TOASTS = 5;
const MESSAGE_TOAST_ROOT_ID = 'ui-vintage-message-toast-root';

const toastTimers = new Map<number, ToastTimer>();
const pendingToastIds = new Set<number>();
let messageToastMountPromise: Promise<void> | null = null;
let nextToastId = 0;

// Shared message toast state (current/isOpen are kept for backward compatibility)
export const messageToastState: MessageToastState = reactive({
    current: null,
    isOpen: false,
    toasts: [],
    paused: false
});

// Keep the legacy single-toast fields in sync with the stack
const syncLegacyState = () => {
    const latest = messageToastState.toasts[0];
    messageToastState.current = latest ? { message: latest.message, type: latest.type } : null;
    messageToastState.isOpen = Boolean(latest);
};

// Mount the toaster once on demand
const ensureMessageToastMounted = () => {
    // Skip mounting during SSR
    if (typeof document === 'undefined') {
        return Promise.resolve();
    }

    // Reuse the existing mount root
    if (document.getElementById(MESSAGE_TOAST_ROOT_ID)) {
        return Promise.resolve();
    }

    // Reuse the in-flight mount
    if (messageToastMountPromise) {
        return messageToastMountPromise;
    }

    // Start the lazy mount
    messageToastMountPromise = (async () => {
        // Load the component only when needed
        const { default: MessageToast } = await import('./MessageToast.vue');

        // Guard against a concurrent mount
        if (document.getElementById(MESSAGE_TOAST_ROOT_ID)) {
            return;
        }

        // Create the host element and render the component
        const container = document.createElement('div');
        container.id = MESSAGE_TOAST_ROOT_ID;
        document.body.appendChild(container);
        render(h(MessageToast), container);
    })().finally(() => {
        messageToastMountPromise = null;
    });

    // Let callers await the mount
    return messageToastMountPromise;
};

// Start (or restart) the auto-dismiss countdown of a toast
const startToastTimer = (id: number) => {
    const timer = toastTimers.get(id);
    if (!timer || timer.handle || messageToastState.paused) return;
    timer.startedAt = Date.now();
    timer.handle = setTimeout(() => closeMessageToast(id), timer.remaining);
};

// Stop the countdown of a toast and remember how much time is left
const stopToastTimer = (id: number) => {
    const timer = toastTimers.get(id);
    if (!timer?.handle) return;
    clearTimeout(timer.handle);
    timer.handle = null;
    timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.startedAt));
};

// Pause every countdown (used while the toaster is hovered or focused)
export const pauseMessageToasts = () => {
    messageToastState.paused = true;
    toastTimers.forEach((_, id) => stopToastTimer(id));
};

// Resume every countdown
export const resumeMessageToasts = () => {
    messageToastState.paused = false;
    toastTimers.forEach((_, id) => startToastTimer(id));
};

// Dismiss one toast by id, or every toast when no id is passed
export const closeMessageToast = (id?: number) => {
    const ids = id === undefined ? messageToastState.toasts.map(toast => toast.id) : [id];

    // Cancel toasts that were requested but are still waiting for the toaster to mount
    if (id === undefined) {
        pendingToastIds.clear();
    } else {
        pendingToastIds.delete(id);
    }

    // Clear timers and remove the toasts from the stack
    for (const toastId of ids) {
        stopToastTimer(toastId);
        toastTimers.delete(toastId);
    }
    messageToastState.toasts = messageToastState.toasts.filter(toast => !ids.includes(toast.id));
    syncLegacyState();
};

// Show a message toast and optionally auto-dismiss it; returns the toast id
export const showMessageToast = (options: ShowMessageToastOptions) => {
    nextToastId += 1;
    const id = nextToastId;
    const duration = options.duration ?? DEFAULT_TOAST_DURATION_MS;

    // Build the toast item
    const toast: MessageToastItem = {
        id,
        message: options.message,
        type: options.type ?? 'success',
        title: options.title ?? '',
        icon: options.icon ? markRaw(options.icon) : null,
        action: options.action ?? null,
        dismissible: options.dismissible ?? true,
        duration
    };

    // Toasts are client-only: never store them in the module state shared across server requests
    if (typeof document === 'undefined') {
        return id;
    }

    // Expose the newest toast synchronously, as the single-toast API always did
    messageToastState.current = { message: toast.message, type: toast.type };

    // Mount first so the enter transition runs once the renderer exists
    pendingToastIds.add(id);
    void ensureMessageToastMounted().then(() => {
        // Skip toasts that were closed before the toaster finished mounting
        if (!pendingToastIds.delete(id)) {
            syncLegacyState();
            return;
        }

        // Push the newest toast on top and trim the overflow
        messageToastState.toasts = [toast, ...messageToastState.toasts];
        for (const overflow of messageToastState.toasts.slice(MAX_TOASTS)) {
            closeMessageToast(overflow.id);
        }
        syncLegacyState();

        // Auto-dismiss the toast after the specified duration
        if (duration > 0) {
            toastTimers.set(id, { handle: null, remaining: duration, startedAt: Date.now() });
            startToastTimer(id);
        }
    });

    return id;
};