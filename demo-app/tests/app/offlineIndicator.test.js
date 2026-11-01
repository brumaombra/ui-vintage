import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import OfflineIndicator from '../../../src/runtime/pwa/OfflineIndicator.vue';

// Tell the page the connection changed, like the browser does
const goOffline = () => window.dispatchEvent(new Event('offline'));
const goOnline = () => window.dispatchEvent(new Event('online'));

// The connection pill the service worker option mounts: hidden while connected, shown when the connection drops, "Back online" for a moment when it returns
describe('OfflineIndicator', () => {
	// Control the clock for the "Back online" timeout
	beforeEach(() => { vi.useFakeTimers(); });
	afterEach(() => { vi.useRealTimers(); });

	// Nothing shows while the page is connected
	it('stays hidden while connected', async () => {
		const wrapper = await mountSuspended(OfflineIndicator);
		expect(wrapper.find('[data-status]').exists()).toBe(false);
		expect(wrapper.find('[role="status"]').exists()).toBe(true); // The live region is always there, so screen readers hear the change
	});

	// The lost connection shows until it comes back, then "Back online" shows for a moment and hides
	it('shows the lost connection, then that it came back', async () => {
		const wrapper = await mountSuspended(OfflineIndicator);
		goOffline();
		await wrapper.vm.$nextTick();
		expect(wrapper.find('[data-status]').attributes('data-status')).toBe('offline');
		expect(wrapper.text()).toContain("You're offline");

		// Back online
		goOnline();
		await wrapper.vm.$nextTick();
		expect(wrapper.find('[data-status]').attributes('data-status')).toBe('online');
		expect(wrapper.text()).toContain('Back online');

		// Hidden after a moment
		vi.advanceTimersByTime(2600);
		await wrapper.vm.$nextTick();
		expect(wrapper.find('[data-status="online"]').exists()).toBe(false);
	});

	// An "online" event without a lost connection before (the browser fires it on its own sometimes) shows nothing
	it('ignores a connection that was never lost', async () => {
		const wrapper = await mountSuspended(OfflineIndicator);
		goOnline();
		await wrapper.vm.$nextTick();
		expect(wrapper.find('[data-status]').exists()).toBe(false);
	});

	// A page opened without a connection shows it at once
	it('shows the lost connection when the page opens offline', async () => {
		const onLine = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
		const wrapper = await mountSuspended(OfflineIndicator);
		await wrapper.vm.$nextTick();
		expect(wrapper.find('[data-status]').attributes('data-status')).toBe('offline');
		onLine.mockRestore();
	});
});