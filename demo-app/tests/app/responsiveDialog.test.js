import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { h } from 'vue';
import { flushPromises } from '@vue/test-utils';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { ResponsiveDialog } from '@brumaombra/ui-vintage/responsive-dialog';

// The dialog renders in a portal, outside the mounted component
const dialog = () => document.querySelector('[data-slot="responsive-dialog"]');
const footer = () => document.querySelector('[data-slot="responsive-dialog-footer"]');

// Screen of the test: a phone, or a larger screen from the md breakpoint up
let isWideScreen = false;
const originalMatchMedia = window.matchMedia;

// Mount an open dialog with a field and a footer button
const mountDialog = props => mountSuspended(ResponsiveDialog, {
	props: { open: true, title: 'Resolve market', description: 'Pick the final outcome.', ...props },
	slots: {
		default: () => h('input', { 'data-test': 'notes' }),
		footer: () => h('button', { 'data-test': 'resolve' }, 'Resolve')
	}
});

// One dialog for every screen: a sheet on phones, a centered dialog or a side panel on larger screens
describe('ResponsiveDialog', () => {
	let wrapper;

	// Answer the media queries of the screen of the test
	beforeEach(() => {
		isWideScreen = false;
		window.matchMedia = query => ({ matches: isWideScreen && query.includes('min-width: 768px'), media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
	});

	// Remove the dialog and give the screen back
	afterEach(() => {
		wrapper?.unmount();
		window.matchMedia = originalMatchMedia;
	});

	// On a phone it is a sheet from the bottom, with room for the home bar under its footer
	it('is a sheet on phones', async () => {
		wrapper = await mountDialog();
		expect(dialog().dataset.mode).toBe('sheet');
		expect(dialog().className).toContain('bottom-0');
		expect(footer().className).toContain('env(safe-area-inset-bottom)');
		expect(footer().className).toContain('flex-col');
	});

	// On a larger screen it is a centered dialog by default, of the size asked, with the buttons on the right
	it('is a centered dialog on larger screens', async () => {
		isWideScreen = true;
		wrapper = await mountDialog({ size: 'md' });
		expect(dialog().dataset.mode).toBe('dialog');
		expect(dialog().className).toContain('sm:max-w-md');
		expect(footer().className).toContain('flex-row-reverse'); // The main action, first in the slot, ends up rightmost
		expect(footer().className).not.toContain('safe-area');
	});

	// Long content can ask for a panel on the right instead
	it('is a side panel on larger screens when asked', async () => {
		isWideScreen = true;
		wrapper = await mountDialog({ desktop: 'panel' });
		expect(dialog().dataset.mode).toBe('panel');
		expect(dialog().className).toContain('right-0');
	});

	// The title names the dialog and the description describes it
	it('links the title and the description', async () => {
		wrapper = await mountDialog();
		const title = document.getElementById(dialog().getAttribute('aria-labelledby'));
		const description = document.getElementById(dialog().getAttribute('aria-describedby'));
		expect(title.textContent).toBe('Resolve market');
		expect(description.textContent).toBe('Pick the final outcome.');
	});

	// Without a description it describes nothing (no link to a missing element)
	it('describes nothing without a description', async () => {
		wrapper = await mountDialog({ description: '' });
		expect(dialog().hasAttribute('aria-describedby')).toBe(false);
	});

	// A hidden description is still read by screen readers
	it('hides the description from sight only', async () => {
		wrapper = await mountDialog({ hideDescription: true });
		expect(document.querySelector('[data-slot="responsive-dialog-description"]').className).toBe('sr-only');
	});

	// The focus goes to the dialog, not to its first field (on phones the keyboard would cover it)
	it('focuses the dialog, not its first field', async () => {
		wrapper = await mountDialog();
		await flushPromises();
		expect(document.activeElement).toBe(dialog());
	});

	// The close button closes it
	it('closes with the close button', async () => {
		wrapper = await mountDialog();
		dialog().querySelector('[aria-label="Close"]').click();
		await flushPromises();
		expect(wrapper.emitted('update:open')).toEqual([[false]]);
	});

	// No footer slot, no footer
	it('leaves the footer out when there is nothing in it', async () => {
		wrapper = await mountSuspended(ResponsiveDialog, { props: { open: true, title: 'Holders' }, slots: { default: () => 'List' } });
		expect(footer()).toBeNull();
	});
});