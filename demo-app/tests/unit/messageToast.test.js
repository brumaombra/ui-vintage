import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { closeMessageToast, messageToastState, pauseMessageToasts, resumeMessageToasts, showMessageToast } from '../../../src/components/message-toast/message-toast-state';

// Wait for the toaster mount promise to settle
const flushMount = () => new Promise(resolve => setTimeout(resolve, 0));

// Toasts are client-only and run their own dismiss timers
describe('message toast state', () => {
    afterEach(() => {
        closeMessageToast();
        vi.unstubAllGlobals();
        vi.useRealTimers();
    });

    // During server rendering nothing is stored in the state shared by every request
    it('does not store toasts during server rendering', async () => {
        const id = showMessageToast({ message: 'Saved' });
        await flushMount();
        expect(typeof id).toBe('number');
        expect(messageToastState.toasts).toHaveLength(0);
        expect(messageToastState.current).toBeNull();
    });

    describe('in the browser', () => {
        // Pretend the toaster is already mounted
        beforeEach(() => {
            vi.stubGlobal('document', { getElementById: () => ({}) });
        });

        // A shown toast lands on top of the stack
        it('shows the newest toast first', async () => {
            showMessageToast({ message: 'First', duration: 0 });
            showMessageToast({ message: 'Second', duration: 0 });
            await flushMount();
            expect(messageToastState.toasts.map(toast => toast.message)).toEqual(['Second', 'First']);
        });

        // Closing a toast right after showing it cancels it before it ever appears
        it('cancels a toast closed before the toaster mounted', async () => {
            const id = showMessageToast({ message: 'Early' });
            closeMessageToast(id);
            await flushMount();
            expect(messageToastState.toasts.some(toast => toast.id === id)).toBe(false);
        });

        // Toasts dismiss themselves after their duration, and hovering pauses the countdown
        it('auto-dismisses after the duration and pauses while hovered', async () => {
            vi.useFakeTimers();
            showMessageToast({ message: 'Timed', duration: 1000 });
            await vi.advanceTimersByTimeAsync(0);

            await vi.advanceTimersByTimeAsync(600);
            pauseMessageToasts();
            await vi.advanceTimersByTimeAsync(5000);
            expect(messageToastState.toasts).toHaveLength(1);

            resumeMessageToasts();
            await vi.advanceTimersByTimeAsync(400);
            expect(messageToastState.toasts).toHaveLength(0);
        });
    });
});
