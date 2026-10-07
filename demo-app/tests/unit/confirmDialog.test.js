import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { closeConfirmDialog, confirmActiveDialog, confirmDialogState, showConfirmDialog } from '../../../src/components/confirm-dialog/confirm-dialog-state';

// Time the dialog keeps for its leave transition before the next one opens
const CLOSE_DURATION_MS = 300;

// Promise-based confirm dialogs: the caller's await must always settle
describe('confirm dialog state', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    // Let any closing dialog finish so every test starts with an empty queue
    afterEach(() => {
        vi.advanceTimersByTime(CLOSE_DURATION_MS * 2);
        vi.useRealTimers();
    });

    // Confirming resolves true
    it('resolves true when confirmed', async () => {
        const result = showConfirmDialog({ message: 'Delete?' });
        await confirmActiveDialog();
        await expect(result).resolves.toBe(true);
    });

    // Escape (or the close button) resolves false
    it('resolves false when closed', async () => {
        const result = showConfirmDialog({ message: 'Delete?' });
        closeConfirmDialog();
        await expect(result).resolves.toBe(false);
    });

    // A failing handler must not leave the caller waiting forever
    it('settles the promise as false and rethrows when onConfirm throws', async () => {
        const result = showConfirmDialog({ message: 'Delete?', onConfirm: () => { throw new Error('Request failed'); } });
        await expect(confirmActiveDialog()).rejects.toThrow('Request failed');
        await expect(result).resolves.toBe(false);
    });

    // Escape while an async confirm is running is ignored, so the action and the answer agree
    it('ignores Escape while the confirm handler is running', async () => {
        let finish;
        const result = showConfirmDialog({ message: 'Delete?', onConfirm: () => new Promise(resolve => { finish = resolve; }) });
        const running = confirmActiveDialog();
        closeConfirmDialog();
        expect(confirmDialogState.isOpen).toBe(true);
        finish();
        await running;
        await expect(result).resolves.toBe(true);
    });

    // A click during the leave transition does not run the action after the user cancelled
    it('ignores a confirm click while the dialog is closing', async () => {
        const onConfirm = vi.fn();
        const result = showConfirmDialog({ message: 'Delete?', onConfirm });
        closeConfirmDialog();
        await confirmActiveDialog();
        expect(onConfirm).not.toHaveBeenCalled();
        await expect(result).resolves.toBe(false);
    });

    // Dialogs are queued: the second one opens after the first has closed
    it('opens queued dialogs one at a time', async () => {
        const first = showConfirmDialog({ message: 'First' });
        const second = showConfirmDialog({ message: 'Second' });
        expect(confirmDialogState.current?.options.message).toBe('First');

        await confirmActiveDialog();
        vi.advanceTimersByTime(CLOSE_DURATION_MS);
        expect(confirmDialogState.current?.options.message).toBe('Second');
        expect(confirmDialogState.isOpen).toBe(true);

        closeConfirmDialog();
        await expect(first).resolves.toBe(true);
        await expect(second).resolves.toBe(false);
    });
});
