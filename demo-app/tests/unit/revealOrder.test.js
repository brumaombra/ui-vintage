import { describe, expect, it } from 'vitest';
import { computeRevealDelays, REVEAL_MAX_DELAY_MS, REVEAL_STEP_MS } from '../../../src/lib/reveal-order';

// Elements revealed together get delays in their on-screen order, whatever their order in the page source
describe('computeRevealDelays', () => {
	// A 3-column grid: row by row, left to right
	it('staggers a grid row by row and left to right', () => {
		const cards = [
			{ top: 0, left: 0 }, { top: 0, left: 300 }, { top: 0, left: 600 },
			{ top: 400, left: 0 }, { top: 400, left: 300 }
		];
		expect(computeRevealDelays(cards)).toEqual([0, 1, 2, 3, 4].map(position => position * REVEAL_STEP_MS));
	});

	// The bug this fixes: with a delay from the index (index % 3), the first card of the second row could appear before the last card of the first row
	it('never reveals an element before one above it', () => {
		const delays = computeRevealDelays([{ top: 0, left: 600 }, { top: 400, left: 0 }]);
		expect(delays[0]).toBeLessThan(delays[1]);
	});

	// A single column (a phone): plain top-to-bottom order, even when the source order differs
	it('follows the layout, not the source order', () => {
		expect(computeRevealDelays([{ top: 800, left: 0 }, { top: 0, left: 0 }, { top: 400, left: 0 }])).toEqual([2 * REVEAL_STEP_MS, 0, REVEAL_STEP_MS]);
	});

	// Tags of a cloud whose tops differ by a pixel or two are still one row
	it('treats nearly equal tops as one row', () => {
		expect(computeRevealDelays([{ top: 2, left: 200 }, { top: 0, left: 0 }])).toEqual([REVEAL_STEP_MS, 0]);
	});

	// A long list never waits more than the maximum
	it('caps the delay', () => {
		const items = Array.from({ length: 30 }, (_, index) => ({ top: index * 50, left: 0 }));
		expect(Math.max(...computeRevealDelays(items))).toBe(REVEAL_MAX_DELAY_MS);
	});

	// A pass that comes while the previous one is still waiting starts after it, so a fast scroll keeps one order (the bug: the last card of one pass appeared after the first card of the next)
	it('starts after the previous pass', () => {
		expect(computeRevealDelays([{ top: 0, left: 0 }, { top: 0, left: 300 }], { start: 210 })).toEqual([210, 210 + REVEAL_STEP_MS]);
	});

	// An element that asks for a longer delay itself keeps it
	it('keeps an element own delay as a minimum', () => {
		expect(computeRevealDelays([{ top: 0, left: 0, ownDelay: 300 }, { top: 100, left: 0 }])).toEqual([300, REVEAL_STEP_MS]);
	});
});