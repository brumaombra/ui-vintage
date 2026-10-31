import { afterEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ConfirmDialog from '../../../src/components/confirm-dialog/ConfirmDialog.vue';
import { showConfirmDialog, closeConfirmDialog } from '@brumaombra/ui-vintage/confirm-dialog';

// The dialog renders in a portal, outside the mounted component
const content = () => document.querySelector('[data-slot="alert-dialog-content"]');
const footer = () => document.querySelector('[data-slot="alert-dialog-footer"]');

// Wait for the dialog (a dialog opened right after another waits for its leave transition)
const waitForDialog = () => vi.waitFor(() => expect(content()).not.toBeNull(), { timeout: 2000, interval: 50 });

// Alert dialogs (confirm, message) are a dialog in the middle, and an action sheet from the bottom on phones
describe('Alert dialog on phones', () => {
	let wrapper;

	// Close the dialog and remove it
	afterEach(() => {
		closeConfirmDialog();
		wrapper?.unmount();
	});

	// On phones it sits at the bottom, full width, with rounded top corners and room for the home bar
	it('is an action sheet on phones', async () => {
		wrapper = await mountSuspended(ConfirmDialog);
		void showConfirmDialog({ title: 'Delete 3 invoices?', message: 'They cannot be recovered.', confirmText: 'Delete', cancelText: 'Cancel' });
		await flushPromises();
		await waitForDialog();
		expect(content().className).toEqual(expect.stringContaining('max-sm:bottom-0'));
		expect(content().className).toEqual(expect.stringContaining('max-sm:w-full'));
		expect(content().className).toEqual(expect.stringContaining('max-sm:rounded-t-lg'));
		expect(footer().className).toEqual(expect.stringContaining('env(safe-area-inset-bottom)'));
	});

	// The main action comes first on phones: the buttons stack in reverse, so the confirm button (last in the markup) is on top
	it('puts the main action on top on phones', async () => {
		wrapper = await mountSuspended(ConfirmDialog);
		void showConfirmDialog({ title: 'Delete?', message: 'Sure?', confirmText: 'Delete', cancelText: 'Cancel' });
		await flushPromises();
		await waitForDialog();
		expect(footer().className).toEqual(expect.stringContaining('flex-col-reverse'));
		expect([...footer().querySelectorAll('button')].map(button => button.textContent.trim())).toEqual(['Cancel', 'Delete']);
	});
});