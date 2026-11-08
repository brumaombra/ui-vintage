import { afterEach, describe, expect, it, vi } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { TitleHighlight } from '@brumaombra/ui-vintage/title-highlight';

// A stand-in for the browser's IntersectionObserver: the test says when the words come into view
let observed = [];
class FakeIntersectionObserver {
	constructor(callback) {
		this.callback = callback;
		observed.push(this);
	}

	observe() {}
	disconnect() {
		this.disconnected = true;
	}
}

// Highlighted words of a title: the text keeps its color, the underline carries the brand orange and draws itself in when seen
describe('TitleHighlight', () => {
	let wrapper;

	// The highlight itself (the mount wraps it)
	const root = () => wrapper.find('[data-slot="title-highlight"]');

	// Unmount and forget the observers
	afterEach(() => {
		wrapper?.unmount();
		observed = [];
		vi.unstubAllGlobals();
	});

	// The words keep the text color (orange text is only 2.2:1 on a light background), and the underline is the brand orange
	it('keeps the text color and draws the underline in the brand orange', async () => {
		wrapper = await mountSuspended(TitleHighlight, { slots: { default: () => 'works' } });
		expect(wrapper.text()).toBe('works');
		expect(root().classes()).not.toContain('text-primary');
		expect(wrapper.find('svg').classes()).toContain('text-primary');
		expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true');
	});

	// Without a delay the underline is just there, never hidden
	it('leaves the underline still without a delay', async () => {
		wrapper = await mountSuspended(TitleHighlight, { slots: { default: () => 'works' } });
		expect(root().attributes('data-state')).toBe('still');
		expect(wrapper.find('path').classes().join(' ')).not.toContain('stroke-dashoffset:1');
	});

	// With a delay it waits for the words to be seen (it drew on page load, before a section lower down was reached), then draws after the delay
	it('draws itself in once the words come into view', async () => {
		vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
		wrapper = await mountSuspended(TitleHighlight, { props: { drawDelay: '300ms' }, slots: { default: () => 'works' } });
		const path = () => wrapper.find('path');

		// Hidden while waiting, only where scripts run and motion is welcome (so it is still there without JavaScript)
		expect(root().attributes('data-state')).toBe('waiting');
		expect(path().classes()).toContain('motion-safe:[@media(scripting:enabled)]:[stroke-dashoffset:1]');
		expect(path().classes()).not.toContain('motion-safe:animate-uv-draw');

		// Seen: it draws after the delay, and stops watching
		observed[0].callback([{ isIntersecting: true }]);
		await wrapper.vm.$nextTick();
		expect(root().attributes('data-state')).toBe('drawing');
		expect(path().classes()).toContain('motion-safe:animate-uv-draw');
		expect(path().attributes('style')).toContain('animation-delay: 300ms');
		expect(observed[0].disconnected).toBe(true);
	});

	// A smaller underline for body text
	it('has a smaller underline for body text', async () => {
		wrapper = await mountSuspended(TitleHighlight, { props: { size: 'sm' }, slots: { default: () => 'maker' } });
		expect(wrapper.find('svg').classes()).toContain('h-2.5');
	});
});