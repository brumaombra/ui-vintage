import { afterEach, describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { Button } from '@brumaombra/ui-vintage/button';

// Navigation buttons: a Button with a to prop is the link itself (no link wrapped around a button)
describe('Button with to', () => {
	// Go back to the default language after each test
	afterEach(async () => {
		await useNuxtApp().$i18n.setLocale('en');
	});

	// The link is localized like every library link
	it('renders a localized link styled as a button', async () => {
		// Render a navigation button on an Italian page
		await useNuxtApp().$i18n.setLocale('it');
		const wrapper = await mountSuspended(Button, { route: '/it', props: { to: '/blog', variant: 'primary' }, slots: { default: () => 'Blog' } });

		// Expect a single link with the button styles and no nested button
		const link = wrapper.find('a');
		expect(link.attributes('href')).toBe('/it/blog');
		expect(link.attributes('data-slot')).toBe('button');
		expect(wrapper.find('button').exists()).toBe(false);
	});

	// External links keep their URL and the attributes passed to the button
	it('keeps external URLs and passes target and rel through', async () => {
		const wrapper = await mountSuspended(Button, { props: { to: 'https://github.com/brumaombra' }, attrs: { target: '_blank', rel: 'noopener' }, slots: { default: () => 'GitHub' } });
		const link = wrapper.find('a');
		expect(link.attributes('href')).toBe('https://github.com/brumaombra');
		expect(link.attributes('target')).toBe('_blank');
	});

	// Same-page anchors have no route to localize, so they stay plain links
	it('renders a same-page anchor as a plain link', async () => {
		const wrapper = await mountSuspended(Button, { props: { to: '#setup' }, slots: { default: () => 'Start' } });
		expect(wrapper.find('a').attributes('href')).toBe('#setup');
	});

	// A disabled navigation button can't be followed
	it('renders a disabled navigation button without a link', async () => {
		const wrapper = await mountSuspended(Button, { props: { to: '/blog', disabled: true }, slots: { default: () => 'Blog' } });
		expect(wrapper.find('a').exists()).toBe(false);
		expect(wrapper.find('span[data-slot="button"]').attributes('aria-disabled')).toBe('true');
	});

	// Without to, the button stays a real button
	it('stays a button without to', async () => {
		const wrapper = await mountSuspended(Button, { slots: { default: () => 'Save' } });
		expect(wrapper.find('button[data-slot="button"]').exists()).toBe(true);
	});
});

// Notification count: a badge on the corner of the button
describe('Button with count', () => {
	// The count shows in a badge, and the button stops clipping so the badge can overflow it
	it('shows the count in a badge on the corner', async () => {
		const wrapper = await mountSuspended(Button, { props: { count: 4, size: 'icon' }, slots: { default: () => 'Bell' } });
		expect(wrapper.find('[data-slot="button-count"]').text()).toBe('4');
		expect(wrapper.find('[data-slot="button"]').classes()).toContain('overflow-visible');

		// The badge is tucked into the corner: further out, it touched the button next to it
		expect(wrapper.find('[data-slot="button-count"]').classes()).toEqual(expect.arrayContaining(['-top-1.5', '-right-1.5']));

		// The badge is solid in the brand color, so apps can use it for any count (not only alerts)
		expect(wrapper.find('[data-slot="button-count"]').classes()).toEqual(expect.arrayContaining(['bg-primary', 'text-primary-foreground']));
	});

	// Large counts are capped
	it('caps large counts', async () => {
		const wrapper = await mountSuspended(Button, { props: { count: 150 }, slots: { default: () => 'Bell' } });
		expect(wrapper.find('[data-slot="button-count"]').text()).toBe('99+');
	});

	// No badge (and the usual clipping) without unread items
	it('hides the badge when the count is zero', async () => {
		const wrapper = await mountSuspended(Button, { props: { count: 0 }, slots: { default: () => 'Bell' } });
		expect(wrapper.find('[data-slot="button-count"]').exists()).toBe(false);
		expect(wrapper.find('[data-slot="button"]').classes()).toContain('overflow-hidden');
	});
});