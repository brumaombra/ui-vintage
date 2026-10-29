import { h, nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { configureBusyIndicator, setBusy } from '@brumaombra/ui-vintage/busy-indicator';

// Wait until the lazily mounted indicator has rendered
const waitForRender = async () => {
	for (let attempt = 0; attempt < 20; attempt++) {
		await new Promise(resolve => setTimeout(resolve, 10));
		await nextTick();
		if (document.querySelector('[role="status"]')) return;
	}
};

// Global busy indicator: the default card, and the whole screen with the app's own mark
describe('busy indicator', () => {
	// Hide it and restore the default look after each test
	afterEach(async () => {
		setBusy(false);
		configureBusyIndicator({ variant: 'card', mark: null });
		await nextTick();
	});

	// The whole screen shows the app's mark instead of the spinner, with the label
	it('covers the whole screen with the configured mark', async () => {
		configureBusyIndicator({ variant: 'fullscreen', mark: { render: () => h('svg', { 'data-testid': 'app-mark' }) } });
		setBusy(true, { label: 'Creating...' });
		await waitForRender();
		const screen = document.querySelector('[data-slot="busy-screen"]');
		expect(screen).not.toBeNull();
		expect(screen.classList).toContain('fixed');
		expect(screen.classList).toContain('inset-0');
		expect(screen.querySelector('[data-testid="app-mark"]')).not.toBeNull();
		expect(screen.textContent).toContain('Creating...');
	});

	// Without a mark the whole screen falls back to the spinner
	it('shows the spinner on the whole screen without a mark', async () => {
		configureBusyIndicator({ variant: 'fullscreen' });
		setBusy(true);
		await waitForRender();
		const screen = document.querySelector('[data-slot="busy-screen"]');
		expect(screen).not.toBeNull();
		expect(screen.querySelector('[data-testid="app-mark"]')).toBeNull();
	});

	// The default stays the card over the page
	it('keeps the card by default', async () => {
		setBusy(true, { label: 'Saving...' });
		await waitForRender();
		expect(document.querySelector('[data-slot="busy-screen"]')).toBeNull();
		expect(document.body.textContent).toContain('Saving...');
	});
});