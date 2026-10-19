import { afterEach, describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { DashboardShell } from '@brumaombra/ui-vintage/dashboard-shell';
import { LandingFooter } from '@brumaombra/ui-vintage/landing-footer';
import { LandingNavbar } from '@brumaombra/ui-vintage/landing-navbar';
import { TextLink } from '@brumaombra/ui-vintage/text-link';

// Switch the app language for a test
const setLanguage = async language => {
	await useNuxtApp().$i18n.setLocale(language);
};

// Mount a component on an Italian page (the links read the language from the current route)
const mountInItalian = async (component, props) => {
	await setLanguage('it');
	return await mountSuspended(component, { route: '/it', props });
};

// Links: the components take plain paths and localize them (for the app's routes), external URLs stay as they are
describe('library links', () => {
	// Go back to the default language after each test
	afterEach(async () => {
		await setLanguage('en');
	});

	// The footer used to render plain anchors, so its links reloaded the page and lost the language
	it('localizes the footer links and keeps external links in a new tab', async () => {
		// Render the footer in Italian
		const sections = [{ id: 'explore', title: 'Explore', links: [{ id: 'blog', label: 'Blog', to: '/blog/tags' }, { id: 'github', label: 'GitHub', to: 'https://github.com/brumaombra', newTab: true }] }];
		const wrapper = await mountInItalian(LandingFooter, { appName: 'Acme', sections });

		// Expect the home and internal links in Italian, and the external link untouched in a new tab
		expect(wrapper.find('a[href="/it"]').exists()).toBe(true);
		expect(wrapper.find('a[href="/it/blog/tags"]').exists()).toBe(true);
		expect(wrapper.find('a[href="https://github.com/brumaombra"]').attributes('target')).toBe('_blank');
	});

	// The navbar logo used to link to the unprefixed home page
	it('localizes the navbar home link', async () => {
		const wrapper = await mountInItalian(LandingNavbar, { appName: 'Acme', appLinkTo: '/blog' });
		expect(wrapper.find('a[href="/it/blog"]').exists()).toBe(true);
	});

	// The dashboard sidebar used to render plain anchors unless the app passed a link component
	it('localizes the dashboard sidebar links', async () => {
		const sidebarSections = [{ id: 'main', items: [{ id: 'blog', label: 'Blog', to: '/blog' }] }];
		const wrapper = await mountInItalian(DashboardShell, { appName: 'Acme', sidebarSections });
		expect(wrapper.find('a[href="/it/blog"]').exists()).toBe(true);
	});

	// Paths that already carry the language prefix (Nuxt Content paths) are not prefixed twice
	it('keeps an already localized path as it is', async () => {
		const wrapper = await mountInItalian(TextLink, { to: '/it/blog', text: 'Blog' });
		expect(wrapper.find('a').attributes('href')).toBe('/it/blog');
	});
});
