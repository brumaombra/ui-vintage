import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { busyIndicatorState, setBusy } from '@brumaombra/ui-vintage/busy-indicator';

// The minimum duration of the busy overlay: it stays up at least that long, so a quick action doesn't just flicker it
describe('setBusy minDuration', () => {
	beforeEach(() => { vi.useFakeTimers(); });
	afterEach(async () => {
		await vi.runAllTimersAsync();
		vi.useRealTimers();
	});

	// Without a minimum, it hides at once
	it('hides at once by default', async () => {
		setBusy(true);
		await setBusy(false);
		expect(busyIndicatorState.show).toBe(false);
	});

	// A quick action keeps it up for the rest of the minimum, and the hide resolves when it's gone
	it('stays up for the minimum duration', async () => {
		setBusy(true, { minDuration: 2400 });
		vi.advanceTimersByTime(300);
		let hidden = false;
		setBusy(false).then(() => { hidden = true; });
		expect(busyIndicatorState.show).toBe(true);
		await vi.advanceTimersByTimeAsync(2000);
		expect(busyIndicatorState.show).toBe(true);
		await vi.advanceTimersByTimeAsync(100);
		expect(busyIndicatorState.show).toBe(false);
		expect(hidden).toBe(true);
	});

	// A slow action, longer than the minimum, hides as soon as it ends
	it('hides at once after a slow action', async () => {
		setBusy(true, { minDuration: 2400 });
		vi.advanceTimersByTime(3000);
		await setBusy(false);
		expect(busyIndicatorState.show).toBe(false);
	});

	// Shown again while the hide waits (a second action right after): it stays up, and the old hide doesn't close it
	it('stays up when shown again before hiding', async () => {
		setBusy(true, { minDuration: 2400 });
		setBusy(false);
		vi.advanceTimersByTime(500);
		setBusy(true, { label: 'Again' });
		await vi.advanceTimersByTimeAsync(3000);
		expect(busyIndicatorState.show).toBe(true);
		expect(busyIndicatorState.label).toBe('Again');
		await setBusy(false);
		expect(busyIndicatorState.show).toBe(false);
	});
});