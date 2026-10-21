import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { SupportButton } from '@brumaombra/ui-vintage/support-button';

// Support buttons: the link to the creator page, the texts, and the looks
describe('support button', () => {
	// The username builds the platform link, opened in a new tab
	it.each([
		['patreon', 'https://www.patreon.com/brumaombra'],
		['kofi', 'https://ko-fi.com/brumaombra']
	])('links the %s page from the username', async (platform, url) => {
		const wrapper = await mountSuspended(SupportButton, { props: { platform, username: 'brumaombra' } });
		const link = wrapper.find('a');
		expect(link.attributes('href')).toBe(url);
		expect(link.attributes('target')).toBe('_blank');
		expect(link.attributes('rel')).toContain('noopener');
	});

	// An explicit href wins over the username
	it('uses the href when given', async () => {
		const wrapper = await mountSuspended(SupportButton, { props: { platform: 'kofi', username: 'brumaombra', href: 'https://ko-fi.com/s/shop' } });
		expect(wrapper.find('a').attributes('href')).toBe('https://ko-fi.com/s/shop');
	});

	// Default labels come from the library translations, and the accessible name says it opens a new tab
	it('shows the translated label and an accessible name', async () => {
		const wrapper = await mountSuspended(SupportButton, { props: { platform: 'patreon', username: 'brumaombra' } });
		expect(wrapper.text()).toContain('Support me on Patreon');
		expect(wrapper.find('a').attributes('aria-label')).toBe('Support me on Patreon (opens in a new tab)');
	});

	// The card shows a title and a description instead of the button label
	it('renders the card with a title and a description', async () => {
		const wrapper = await mountSuspended(SupportButton, { props: { platform: 'kofi', username: 'brumaombra', variant: 'card' } });
		expect(wrapper.text()).toContain('Buy me a coffee');
		expect(wrapper.text()).toContain('One-time tip on Ko-fi');
	});

	// Icon-only buttons hide the label but keep the accessible name
	it('keeps the accessible name when icon-only', async () => {
		const wrapper = await mountSuspended(SupportButton, { props: { platform: 'kofi', username: 'brumaombra', iconOnly: true } });
		expect(wrapper.text()).toBe('');
		expect(wrapper.find('a').attributes('aria-label')).toBe('Buy me a coffee on Ko-fi (opens in a new tab)');
	});

	// The label slot and the label prop override the default text
	it('lets the app change the label', async () => {
		const wrapper = await mountSuspended(SupportButton, { props: { platform: 'patreon', username: 'brumaombra', label: 'Become a patron' } });
		expect(wrapper.text()).toContain('Become a patron');
	});
});