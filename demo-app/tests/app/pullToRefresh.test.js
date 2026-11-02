import { afterEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { PullToRefresh } from '@brumaombra/ui-vintage/pull-to-refresh';

// A touch event on the page, at a point
const touch = (type, x, y) => {
	const event = new Event(type, { cancelable: true });
	Object.defineProperty(event, 'touches', { value: type === 'touchend' ? [] : [{ clientX: x, clientY: y }] });
	window.dispatchEvent(event);
	return event;
};

// A finger dragging from one point to another, then lifting
const drag = (from, to, steps = 5) => {
	touch('touchstart', from.x, from.y);
	for (let step = 1; step <= steps; step++) touch('touchmove', from.x + ((to.x - from.x) * step) / steps, from.y + ((to.y - from.y) * step) / steps);
	touch('touchend');
};

// Pretend to be the installed app on a phone (or not)
const stubDevice = ({ installed = true, touchScreen = true } = {}) => {
	vi.spyOn(window, 'matchMedia').mockImplementation(query => ({ matches: query.includes('standalone') ? installed : query.includes('coarse') ? touchScreen : false, addEventListener() {}, removeEventListener() {} }));
};

// Pull down at the top of a page to reload its data
describe('PullToRefresh', () => {
	afterEach(() => { vi.restoreAllMocks(); });

	// Mount it with a refresh that resolves at once
	const mountPull = async (props = {}) => {
		const refresh = vi.fn(async () => {});
		const wrapper = await mountSuspended(PullToRefresh, { props: { refresh, minDuration: 0, ...props }, slots: { default: () => 'Page' } });
		await flushPromises();
		return { wrapper, refresh };
	};

	// A downward pull past the threshold refreshes, and the page comes back once it's done
	it('refreshes after a long enough pull', async () => {
		stubDevice();
		const { wrapper, refresh } = await mountPull();
		drag({ x: 100, y: 100 }, { x: 100, y: 300 }); // 200px of finger, 100px of page: past the 72px threshold
		await flushPromises();
		expect(refresh).toHaveBeenCalledTimes(1);
		await vi.waitFor(() => expect(wrapper.find('[data-slot="pull-to-refresh"]').attributes('data-state')).toBe('idle'));
		wrapper.unmount();
	});

	// A short pull slides back without refreshing
	it('does nothing after a short pull', async () => {
		stubDevice();
		const { wrapper, refresh } = await mountPull();
		drag({ x: 100, y: 100 }, { x: 100, y: 160 });
		await flushPromises();
		expect(refresh).not.toHaveBeenCalled();
		wrapper.unmount();
	});

	// A sideways swipe (a carousel) is left alone, even if it drifts down
	it('ignores a sideways swipe', async () => {
		stubDevice();
		const { wrapper, refresh } = await mountPull();
		drag({ x: 300, y: 100 }, { x: 40, y: 260 });
		await flushPromises();
		expect(refresh).not.toHaveBeenCalled();
		wrapper.unmount();
	});

	// While pulling, the page follows the finger and the browser doesn't scroll it
	it('moves the page and holds the scroll while pulling', async () => {
		stubDevice();
		const { wrapper } = await mountPull();
		touch('touchstart', 100, 100);
		const move = touch('touchmove', 100, 200);
		await flushPromises();
		expect(move.defaultPrevented).toBe(true);
		expect(wrapper.find('[data-slot="pull-to-refresh-content"]').attributes('style')).toContain('translate: 0 50px');
		touch('touchend');
		wrapper.unmount();
	});

	// In a browser tab (it has its own pull to refresh) or without a touch screen, nothing happens
	it.each([[{ installed: false }], [{ touchScreen: false }]])('stays off for %o', async device => {
		stubDevice(device);
		const { wrapper, refresh } = await mountPull();
		drag({ x: 100, y: 100 }, { x: 100, y: 300 });
		await flushPromises();
		expect(refresh).not.toHaveBeenCalled();
		wrapper.unmount();
	});
});