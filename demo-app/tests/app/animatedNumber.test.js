import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { AnimatedNumber } from '@brumaombra/ui-vintage/animated-number';

// The count-up of the animated number, frame by frame
describe('AnimatedNumber', () => {
	let frames;

	// Run the frames by hand: each call to requestAnimationFrame waits for the next timestamp
	const useManualFrames = () => {
		frames = [];
		vi.stubGlobal('requestAnimationFrame', callback => frames.push(callback));
		vi.stubGlobal('cancelAnimationFrame', () => {});
	};

	// Play the frames at these times (in milliseconds), then frames long after until nothing waits (other code can ask for frames too and take one of the times), and read the digits shown after each
	const playFrames = async (wrapper, times) => {
		const shown = [];
		const play = async time => {
			frames.shift()(time);
			await nextTick();
			shown.push(wrapper.find('[aria-hidden="true"]').text());
		};
		for (const time of times) {
			if (!frames.length) break;
			await play(time);
		}
		const lateTime = times.at(-1) + 60000;
		for (let guard = 0; frames.length && guard < 100; guard++) await play(lateTime);
		return shown;
	};

	// Restore the browser timing
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	// A frame can carry a time earlier than performance.now() when it was asked: the first frame showed a negative number (-239 on the way to 678)
	it('never goes below the starting value', async () => {
		useManualFrames();
		const beforeMount = performance.now();
		const wrapper = await mountSuspended(AnimatedNumber, { props: { value: 678.33, duration: 1000, locale: 'en', formatOptions: { minimumFractionDigits: 2, maximumFractionDigits: 2 } } });
		const shown = await playFrames(wrapper, [beforeMount - 10, beforeMount + 100, beforeMount + 300, beforeMount + 700, beforeMount + 1000, beforeMount + 1100]);
		const values = shown.map(text => Number(text.replace(/,/g, '')));
		expect(values.every(value => value >= 0 && value <= 678.33)).toBe(true);
		expect(values).toEqual([...values].sort((a, b) => a - b));
		expect(shown.at(-1)).toBe('678.33');
	});

	// With the precision fixed, every frame shows the same number of decimals, so the number does not shift
	it('keeps the decimals of the format on every frame', async () => {
		useManualFrames();
		const wrapper = await mountSuspended(AnimatedNumber, { props: { value: 600, duration: 1000, locale: 'en', formatOptions: { minimumFractionDigits: 2, maximumFractionDigits: 2 } } });
		const startedAt = performance.now();
		const shown = await playFrames(wrapper, [startedAt, startedAt + 250, startedAt + 500, startedAt + 1000, startedAt + 1200]);
		expect(shown.every(text => /^\d{1,3}(,\d{3})*\.\d{2}$/.test(text))).toBe(true);
		expect(shown.at(-1)).toBe('600.00');
	});
});