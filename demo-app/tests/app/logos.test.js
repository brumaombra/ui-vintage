import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { DashboardShell } from '@brumaombra/ui-vintage/dashboard-shell';
import { LandingFooter } from '@brumaombra/ui-vintage/landing-footer';
import { LandingNavbar } from '@brumaombra/ui-vintage/landing-navbar';

// App logos: SVG files are served as they are, other images still go through the image resizer
describe('app logos', () => {
	// SVG logos used to go through IPX, whose prerendered copies the Node server sends as text/plain (so the logo didn't show)
	it.each([
		['navbar', LandingNavbar],
		['footer', LandingFooter],
		['dashboard shell', DashboardShell]
	])('serves SVG logos straight from their path in the %s', async (name, component) => {
		// Render the component with a light and a dark SVG logo
		const wrapper = await mountSuspended(component, { props: { appName: 'Acme', appLogo: '/images/logo/acme-mark.svg', appLogoDark: '/images/logo/acme-mark-dark.svg' } });

		// Expect both logos with their own path, not an /_ipx one
		const sources = wrapper.findAll('img').map(image => image.attributes('src'));
		expect(sources).toContain('/images/logo/acme-mark.svg');
		expect(sources).toContain('/images/logo/acme-mark-dark.svg');
	});

	// Raster logos keep the resized copies
	it('still resizes raster logos', async () => {
		const wrapper = await mountSuspended(LandingNavbar, { props: { appName: 'Acme', appLogo: '/images/logo/acme-logo.png' } });
		expect(wrapper.find('img').attributes('src')).toContain('/_ipx/');
	});
});