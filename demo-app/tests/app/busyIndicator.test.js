import { h, nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { setBusy } from '@brumaombra/ui-vintage/busy-indicator';

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
	// Hide it after each test
	afterEach(async () => {
		setBusy(false);
		await nextTick();
	});

	// The whole screen shows the app's mark instead of the spinner, with the label
	it('covers the whole screen with the configured mark', async () => {
		setBusy(true, { label: 'Creating...', variant: 'fullscreen', mark: { render: () => h('svg', { 'data-testid': 'app-mark' }) } });
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
		setBusy(true, { variant: 'fullscreen' });
		await waitForRender();
		const screen = document.querySelector('[data-slot="busy-screen"]');
		expect(screen).not.toBeNull();
		expect(screen.querySelector('[data-testid="app-mark"]')).toBeNull();
	});

	// Each call picks its look: after the whole screen, a call without options is the card again
	it('goes back to the card without options', async () => {
		setBusy(true, { variant: 'fullscreen' });
		await waitForRender();
		setBusy(false);
		setBusy(true, { label: 'Saving...' });
		await waitForRender();
		expect(document.querySelector('[data-slot="busy-screen"]')).toBeNull();
		expect(document.body.textContent).toContain('Saving...');
	});
});