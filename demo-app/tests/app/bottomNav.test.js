import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { BottomNav } from '@brumaombra/ui-vintage/bottom-nav';
import { DashboardShell } from '@brumaombra/ui-vintage/dashboard-shell';

// Items of a bottom navigation: the current page, the main action and another page
const ITEMS = [
	{ id: 'home', label: 'Home', to: '/home', active: true },
	{ id: 'create', label: 'Create', to: '/create', primary: true },
	{ id: 'profile', label: 'Profile', to: '/profile' }
];

// Find the sidebar button in the topbar
const findSidebarTrigger = wrapper => wrapper.find('header [data-sidebar="trigger"]');

// Bottom navigation for phones: one link per item, the current page marked, the main action as a button
describe('BottomNav', () => {
	// The navigation is named, and screen readers hear which link is the current page
	it('names the navigation and marks the current page', async () => {
		const wrapper = await mountSuspended(BottomNav, { props: { items: ITEMS } });

		// Expect a named navigation landmark with one link per item
		expect(wrapper.find('nav').attributes('aria-label')).toBe('Main navigation');
		expect(wrapper.findAll('a').map(link => link.attributes('href'))).toEqual(['/home', '/create', '/profile']);

		// Expect only the active item to be the current page
		expect(wrapper.find('a[href="/home"]').attributes('aria-current')).toBe('page');
		expect(wrapper.find('a[href="/profile"]').attributes('aria-current')).toBeUndefined();
	});

	// The primary item is an icon button: its label is for screen readers, not written under it
	it('labels the primary item for screen readers only', async () => {
		const wrapper = await mountSuspended(BottomNav, { props: { items: ITEMS } });

		// Expect the primary link to carry its label, with no visible text
		const primaryLink = wrapper.find('a[href="/create"]');
		expect(primaryLink.attributes('aria-label')).toBe('Create');
		expect(primaryLink.text()).toBe('');

		// Expect the other items to show their label
		expect(wrapper.find('a[href="/profile"]').text()).toBe('Profile');
	});
});

// Dashboard shell with a bottom navigation on phones (opt-in: without items nothing changes)
describe('DashboardShell bottom navigation', () => {
	// Without items the shell stays as it was: no bottom navigation, the sidebar button on every size
	it('changes nothing without bottom navigation items', async () => {
		const wrapper = await mountSuspended(DashboardShell, { props: { appName: 'Acme', title: 'Projects' } });

		// Expect no bottom navigation and a sidebar button visible on phones too
		expect(wrapper.find('nav[aria-label="Main navigation"]').exists()).toBe(false);
		expect(findSidebarTrigger(wrapper).classes()).not.toContain('max-md:hidden');
		expect(wrapper.find('header [data-orientation="vertical"]').exists()).toBe(true);
	});

	// With items, phones get the bottom navigation, and the home link takes the place of the sidebar button
	it('swaps the sidebar for the bottom navigation on phones', async () => {
		const wrapper = await mountSuspended(DashboardShell, { props: { appName: 'Acme', appLogo: '/logo.svg', title: 'Projects', bottomNavItems: ITEMS } });

		// Expect the bottom navigation, and the sidebar button and its separator hidden on phones only
		expect(wrapper.find('nav[aria-label="Main navigation"]').exists()).toBe(true);
		expect(findSidebarTrigger(wrapper).classes()).toContain('max-md:hidden');
		expect(wrapper.find('header [data-orientation="vertical"]').classes()).toContain('max-md:hidden');

		// Expect a home link with the logo in the topbar, on phones only
		const homeLink = wrapper.find('header a.md\\:hidden');
		expect(homeLink.find('img').attributes('alt')).toBe('Acme logo');
	});

	// The separator after the sidebar button used to stay even with nothing after it
	it('drops the separator when nothing follows the sidebar button', async () => {
		const wrapper = await mountSuspended(DashboardShell, { props: { appName: 'Acme' } });

		// Expect no separator without a title, a description or leading content
		expect(wrapper.find('header [data-orientation="vertical"]').exists()).toBe(false);
	});
});