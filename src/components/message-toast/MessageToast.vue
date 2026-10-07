<script setup lang="ts">
import { AlertCircleIcon, Cancel01Icon, CheckmarkCircle02Icon, InformationCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { getUiVintageRuntimeMessage } from '../../lib/i18n';
import { cn } from '../../lib/utils';
import { closeMessageToast, messageToastState, pauseMessageToasts, resumeMessageToasts } from './message-toast-state';
import type { MessageToastItem, MessageToastType } from './message-toast-state';

const VISIBLE_TOASTS = 3;
const STACK_OFFSET_PX = 12;
const STACK_GAP_PX = 10;
const SWIPE_THRESHOLD_PX = 80;

const expanded = ref(false);
const heights = reactive(new Map<number, number>());
const swipe = reactive({ id: null as number | null, startX: 0, deltaX: 0 });
const leaveDirection = reactive(new Map<number, number>());

// Localized labels resolved from bundled library messages
const closeAriaLabel = computed(() => getUiVintageRuntimeMessage('uiVintage.buttons.close', 'Close'));
const regionAriaLabel = computed(() => getUiVintageRuntimeMessage('uiVintage.toast.region', 'Notifications'));

// Resolve the icon for each toast type
const getToastIcon = (toast: MessageToastItem) => {
    if (toast.icon) return toast.icon;
    if (toast.type === 'success') return CheckmarkCircle02Icon;
    return toast.type === 'info' ? InformationCircleIcon : AlertCircleIcon;
};

// Resolve the tinted icon tile classes for each toast type
const toneClasses: Record<MessageToastType, string> = {
    success: 'border-success/25 bg-success/10 text-success',
    info: 'border-info/25 bg-info/10 text-info',
    warning: 'border-warning/25 bg-warning/10 text-warning',
    error: 'border-destructive/25 bg-destructive/10 text-destructive'
};

// Progress bar color for each toast type
const progressClasses: Record<MessageToastType, string> = {
    success: 'bg-success',
    info: 'bg-info',
    warning: 'bg-warning',
    error: 'bg-destructive'
};

const toasts = computed(() => messageToastState.toasts);
const frontHeight = computed(() => (toasts.value[0] && heights.get(toasts.value[0].id)) || 0);

// Height of the stack container so the hover area always matches what is visible
const containerHeight = computed(() => {
    const visible = toasts.value.slice(0, VISIBLE_TOASTS);
    if (!visible.length) return 0;
    if (expanded.value) {
        return visible.reduce((total, toast) => total + (heights.get(toast.id) || 0), 0) + STACK_GAP_PX * (visible.length - 1);
    }
    return frontHeight.value + STACK_OFFSET_PX * (visible.length - 1);
});

// Compute the stacked position of a toast from its index (0 = newest)
const getToastStyle = (toast: MessageToastItem, index: number) => {
    const isSwiping = swipe.id === toast.id;
    let offset = 0;
    let scale = 1;

    // Expanded: toasts sit on top of each other with a gap
    if (expanded.value) {
        for (const previous of toasts.value.slice(0, index)) {
            offset += (heights.get(previous.id) || 0) + STACK_GAP_PX;
        }
    } else {
        // Collapsed: toasts peek out behind the front one
        offset = index * STACK_OFFSET_PX;
        scale = 1 - index * 0.05;
    }

    return {
        '--uv-toast-leave-x': `${(leaveDirection.get(toast.id) ?? 1) * 110}%`,
        zIndex: String(100 - index),
        translate: `${isSwiping ? swipe.deltaX : 0}px ${-offset}px`,
        scale: String(scale),
        opacity: index >= VISIBLE_TOASTS ? '0' : isSwiping ? String(1 - Math.min(Math.abs(swipe.deltaX) / 240, 0.6)) : '1',
        height: !expanded.value && index > 0 && frontHeight.value ? `${frontHeight.value}px` : undefined,
        pointerEvents: index >= VISIBLE_TOASTS ? 'none' as const : undefined,
        transition: isSwiping ? 'none' : undefined
    };
};

// Toast content elements currently watched by the observer, by toast id
const observedElements = new Map<number, HTMLElement>();

// Measure toast content heights so the stack can lay itself out
const resizeObserver = typeof ResizeObserver !== 'undefined'
    ? new ResizeObserver((entries) => {
        for (const entry of entries) {
            const id = Number((entry.target as HTMLElement).dataset.toastId);

            // Skip late notifications for toasts that already left
            if (observedElements.get(id) !== entry.target) continue;
            heights.set(id, (entry.target as HTMLElement).offsetHeight);
        }
    })
    : null;

// Register toast content elements with the observer
const observeToast = (element: unknown) => {
    if (element instanceof HTMLElement && resizeObserver) {
        const id = Number(element.dataset.toastId);
        if (observedElements.get(id) === element) return;
        heights.set(id, element.offsetHeight);
        observedElements.set(id, element);
        resizeObserver.observe(element);
    }
};

// Expand the stack and pause timers while the user interacts with it
const handleEnter = () => {
    expanded.value = true;
    pauseMessageToasts();
};

// Collapse the stack and resume timers
const handleLeave = () => {
    expanded.value = false;
    resumeMessageToasts();
};

// Begin a horizontal swipe gesture
const handlePointerDown = (event: PointerEvent, toast: MessageToastItem) => {
    if (!toast.dismissible || event.button !== 0 || (event.target as HTMLElement).closest('button')) return;
    swipe.id = toast.id;
    swipe.startX = event.clientX;
    swipe.deltaX = 0;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
};

// Follow the pointer while swiping
const handlePointerMove = (event: PointerEvent) => {
    if (swipe.id === null) return;
    swipe.deltaX = event.clientX - swipe.startX;
};

// Dismiss the toast when swiped far enough, otherwise spring back
const handlePointerUp = () => {
    if (swipe.id === null) return;
    const id = swipe.id;
    const deltaX = swipe.deltaX;
    swipe.id = null;
    swipe.deltaX = 0;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX) {
        leaveDirection.set(id, Math.sign(deltaX));
        closeMessageToast(id);
    }
};

// Run a toast action and dismiss it
const handleAction = async (toast: MessageToastItem) => {
    closeMessageToast(toast.id);
    await toast.action?.onClick();
};

// Forget measurements of removed toasts
const handleAfterLeave = (element: Element) => {
    const id = Number((element as HTMLElement).dataset.toastId);
    const content = observedElements.get(id);
    if (content) {
        resizeObserver?.unobserve(content);
        observedElements.delete(id);
    }
    heights.delete(id);
    leaveDirection.delete(id);
};

// Reset the interaction state once the stack is empty (mouseleave never fires on a collapsed region)
watch(() => toasts.value.length, (length) => {
    if (length === 0 && expanded.value) {
        handleLeave();
    }
});

// Stop observing on unmount
onBeforeUnmount(() => {
    resizeObserver?.disconnect();
    observedElements.clear();
});
</script>

<template>
    <section :aria-label="regionAriaLabel" class="pointer-events-none fixed inset-x-3 bottom-3 z-60 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[380px]">
        <ol class="pointer-events-auto relative transition-[height] duration-300 ease-out-expo" :style="{ height: `${containerHeight}px` }" @mouseenter="handleEnter" @mouseleave="handleLeave" @focusin="handleEnter" @focusout="handleLeave">
            <TransitionGroup name="uv-toast" @after-leave="handleAfterLeave">
                <li v-for="(toast, index) in toasts" :key="toast.id" :data-toast-id="toast.id" :data-front="index === 0 ? '' : undefined" role="status" :aria-live="toast.type === 'error' || toast.type === 'warning' ? 'assertive' : 'polite'" aria-atomic="true" class="uv-toast absolute inset-x-0 bottom-0 origin-bottom touch-pan-y select-none overflow-hidden rounded border border-border bg-card text-card-foreground shadow-elevated-lg" :style="getToastStyle(toast, index)" @pointerdown="handlePointerDown($event, toast)" @pointermove="handlePointerMove" @pointerup="handlePointerUp" @pointercancel="handlePointerUp">
                    <!-- Measured content -->
                    <div :ref="observeToast" :data-toast-id="toast.id" :class="cn('flex items-start gap-3 p-4 transition-opacity duration-200', !expanded && index > 0 && 'opacity-0')">
                        <!-- Leading type icon -->
                        <div :class="cn('flex size-8 shrink-0 items-center justify-center rounded border', toneClasses[toast.type])">
                            <HugeiconsIcon :icon="getToastIcon(toast)" :stroke-width="1.8" class="size-4.5 animate-uv-pop [animation-delay:120ms]" />
                        </div>

                        <!-- Title and message -->
                        <div class="min-w-0 flex-1 self-center">
                            <p v-if="toast.title" class="m-0 text-sm font-semibold leading-5">
                                {{ toast.title }}
                            </p>
                            <p :class="cn('m-0 text-sm leading-5 wrap-break-word', toast.title && 'text-xs text-muted-foreground sm:text-[13px]')">
                                {{ toast.message }}
                            </p>
                        </div>

                        <!-- Action button -->
                        <button v-if="toast.action" type="button" class="shrink-0 self-center rounded border border-border bg-secondary px-2.5 py-1.5 text-xs font-semibold shadow-elevated-sm outline-none transition-[background-color,border-color,transform] duration-150 hover:border-border-strong hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/45 active:scale-95" @click="handleAction(toast)">
                            {{ toast.action.label }}
                        </button>

                        <!-- Dismiss button -->
                        <button v-if="toast.dismissible" type="button" :aria-label="closeAriaLabel" class="group/close -me-1 -mt-1 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded text-muted-foreground outline-none transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/45" @click="closeMessageToast(toast.id)">
                            <HugeiconsIcon :icon="Cancel01Icon" class="size-4 transition-transform duration-300 ease-spring group-hover/close:rotate-90" />
                        </button>
                    </div>

                    <!-- Countdown bar -->
                    <div v-if="toast.duration > 0" class="absolute inset-x-0 bottom-0 h-0.5 bg-transparent">
                        <div :class="cn('h-full origin-left opacity-60', progressClasses[toast.type])" :style="{ animation: `uv-toast-countdown ${toast.duration}ms linear forwards`, animationPlayState: messageToastState.paused ? 'paused' : 'running' }" />
                    </div>
                </li>
            </TransitionGroup>
        </ol>
    </section>
</template>

<style>
.uv-toast {
    transition:
        translate 480ms var(--ease-spring),
        scale 480ms var(--ease-spring),
        opacity 250ms var(--ease-out-expo),
        height 300ms var(--ease-out-expo),
        transform 480ms var(--ease-spring);
    will-change: translate, scale;
}

.uv-toast-enter-from {
    opacity: 0 !important;
    transform: translateY(110%) scale(0.92);
}

.uv-toast-leave-active {
    transition:
        transform 260ms var(--ease-snappy),
        opacity 200ms var(--ease-snappy) !important;
}

.uv-toast-leave-to {
    opacity: 0 !important;
    transform: translateX(var(--uv-toast-leave-x, 110%));
}

@keyframes uv-toast-countdown {
    from { transform: scaleX(1); }
    to { transform: scaleX(0); }
}
</style>