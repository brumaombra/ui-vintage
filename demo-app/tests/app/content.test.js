import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import RefreshIcon from '@hugeicons/core-free-icons/RefreshIcon';
import { BlogQuote, ProseImg } from '@brumaombra/ui-vintage/content';
import { ErrorPage } from '@brumaombra/ui-vintage/error-page';

// Blog images: the box takes the image's own shape, so the frame drawn around prose images hugs the picture
describe('ProseImg', () => {
	// Blog illustrations are 16:9 and fill the column
	it('reserves a full-width 16:9 box by default', async () => {
		const wrapper = await mountSuspended(ProseImg, { props: { src: '/images/cover.png', alt: 'Cover' } });
		expect(wrapper.attributes('style')).toContain('aspect-ratio: 1672 / 941');
		expect(wrapper.attributes('style')).toContain('width: 100%');
	});

	// A tall phone screenshot capped at 400px used to sit in a full-width 400px box, with the frame far from the picture
	it('narrows the box of a tall image capped in height', async () => {
		const wrapper = await mountSuspended(ProseImg, { props: { src: '/images/phone.jpg', width: '1079', height: '1438' }, attrs: { style: 'max-height: 400px; object-fit: contain;' } });
		const style = wrapper.attributes('style');
		expect(style).toContain('aspect-ratio: 1079 / 1438');
		expect(style).toContain('width: 300px');
		expect(wrapper.classes()).toContain('max-w-full');
		expect(style).toContain('max-height: 400px');
	});

	// Nuxt Content passes the style of a markdown image as an object: the fix used to miss it there, in the real posts
	it('reads the height cap from a style object too', async () => {
		for (const style of [{ 'max-height': '400px', 'object-fit': 'contain' }, { maxHeight: '400px' }, [{ maxHeight: '400px' }]]) {
			const wrapper = await mountSuspended(ProseImg, { props: { src: '/images/phone.jpg', width: 1079, height: 1438 }, attrs: { style } });
			expect(wrapper.attributes('style'), JSON.stringify(style)).toContain('width: 300px');
		}
	});
});

// Pull quotes in blog posts
describe('BlogQuote', () => {
	// The quote comes from the slot, the author is optional
	it('shows the quote and its author', async () => {
		const wrapper = await mountSuspended(BlogQuote, { props: { author: 'Open Gizmo' }, slots: { default: () => h('p', 'Restore the exact previous state.') } });
		expect(wrapper.find('blockquote').text()).toBe('Restore the exact previous state.');
		expect(wrapper.find('figcaption').text()).toContain('Open Gizmo');

		// Expect no caption without an author
		const anonymous = await mountSuspended(BlogQuote, { slots: { default: () => 'Quote' } });
		expect(anonymous.find('figcaption').exists()).toBe(false);
	});
});

// Error page: the default action's icon can be changed (e.g. a refresh icon for "Try again") or removed
describe('ErrorPage', () => {
	// Read the icon drawn in the action button
	const readActionIcon = wrapper => wrapper.find('button svg');

	// The arrow by default, another icon on request, none with null
	it('changes or hides the icon of the action', async () => {
		const arrow = await mountSuspended(ErrorPage, { props: { statusCode: 404 } });
		const refresh = await mountSuspended(ErrorPage, { props: { statusCode: 429, actionIcon: RefreshIcon } });
		const none = await mountSuspended(ErrorPage, { props: { statusCode: 500, actionIcon: null } });
		expect(readActionIcon(arrow).exists()).toBe(true);
		expect(readActionIcon(refresh).exists()).toBe(true);
		expect(readActionIcon(refresh).html()).not.toBe(readActionIcon(arrow).html());
		expect(readActionIcon(none).exists()).toBe(false);
	});
});
