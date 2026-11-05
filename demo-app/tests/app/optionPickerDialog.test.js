import { afterEach, describe, expect, it } from 'vitest';
import { h } from 'vue';
import { flushPromises } from '@vue/test-utils';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import StarIcon from '@hugeicons/core-free-icons/StarIcon';
import { OptionPickerDialog } from '@brumaombra/ui-vintage/option-picker-dialog';

// The picker renders in a portal, outside the mounted component
const cards = () => [...document.querySelectorAll('[data-slot="radio-group-card"]')];
const cardOf = label => cards().find(card => card.textContent.includes(label));

// Options of the tests
const options = [
	{ value: 'light', label: 'Light', icon: StarIcon },
	{ value: 'dark', label: 'Dark', description: 'Easier on the eyes at night' },
	{ value: 'system', label: 'System' }
];

// Pick one option from a list: radio cards in a responsive dialog
describe('OptionPickerDialog', () => {
	let wrapper;

	// Remove the picker from the page
	afterEach(() => {
		wrapper?.unmount();
	});

	// Mount an open picker on the given option
	const mountPicker = async (props = {}, slots = {}) => {
		wrapper = await mountSuspended(OptionPickerDialog, {
			props: { open: true, title: 'Theme', options, modelValue: 'light', ...props },
			slots
		});
		await flushPromises();
		return wrapper;
	};

	// Every option is a radio card, and the current one is checked
	it('shows every option, the current one checked', async () => {
		await mountPicker();
		expect(cards()).toHaveLength(3);
		expect(cardOf('Light').getAttribute('data-state')).toBe('checked');
		expect(cardOf('Dark').getAttribute('data-state')).toBe('unchecked');
		expect(cardOf('Dark').textContent).toContain('Easier on the eyes at night');
	});

	// A tap on an option picks it and closes the picker
	it('picks an option and closes on a tap', async () => {
		await mountPicker();
		cardOf('Dark').click();
		await flushPromises();
		expect(wrapper.emitted('update:modelValue')).toEqual([['dark']]);
		expect(wrapper.emitted('update:open')).toEqual([[false]]);
	});

	// A tap on the current option only closes (nothing changed)
	it('only closes on a tap on the current option', async () => {
		await mountPicker();
		cardOf('Light').click();
		await flushPromises();
		expect(wrapper.emitted('update:modelValue')).toBeUndefined();
		expect(wrapper.emitted('update:open')).toEqual([[false]]);
	});

	// The arrow keys change the pick but keep the picker open, so a keyboard user can move through the list
	it('keeps the picker open while the arrow keys change the pick', async () => {
		await mountPicker();
		cardOf('Light').focus();
		cardOf('Light').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
		await flushPromises();
		await new Promise(resolve => setTimeout(resolve, 10)); // The radio group checks the reached option in a timeout
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['dark']);
		expect(wrapper.emitted('update:open')).toBeUndefined();

		// Expect a tap to close it again once the key is released
		document.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown', bubbles: true }));
		cardOf('System').click();
		await flushPromises();
		expect(wrapper.emitted('update:open')).toEqual([[false]]);
	});

	// The icon slot draws the app's own visual instead of the icon tile, with the option it belongs to
	it('draws the icon slot for every option', async () => {
		await mountPicker({}, { icon: ({ option }) => h('img', { alt: `flag-${option.value}` }) });
		expect(document.querySelectorAll('img[alt^="flag-"]')).toHaveLength(3);
		expect(document.querySelector('img[alt="flag-system"]')).not.toBeNull();
	});
});