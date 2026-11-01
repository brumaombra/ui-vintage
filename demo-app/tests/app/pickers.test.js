import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { DatePicker } from '@brumaombra/ui-vintage/date-picker';
import { DateTimePicker } from '@brumaombra/ui-vintage/date-time-picker';
import { TimePicker } from '@brumaombra/ui-vintage/time-picker';

// The picker opens in a portal (a sheet on phones, a popover on larger screens), outside the mounted component
const sheet = () => document.querySelector('[data-slot="responsive-dialog"]');
const popover = () => document.querySelector('[data-slot="picker-content"]');
const findDay = day => [...document.querySelectorAll('[data-slot="calendar-cell-trigger"]')].find(cell => cell.textContent.trim() === String(day) && !cell.hasAttribute('data-outside-view'));
const confirmButton = () => [...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Confirm');
const tap = async element => {
	element.click();
	await flushPromises();
};

// Screen of the test: a phone, or a larger screen from the md breakpoint up
let isWideScreen = false;
const originalMatchMedia = window.matchMedia;

// The date and time pickers: a field that opens the calendar and the time wheels
describe('Pickers', () => {
	let wrapper;

	// A phone on Sunday 1 November 2026 (only the date is faked, so the timers of the components run)
	beforeEach(() => {
		isWideScreen = false;
		window.matchMedia = query => ({ matches: isWideScreen && query.includes('min-width: 768px'), media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
		vi.useFakeTimers({ toFake: ['Date'] });
		vi.setSystemTime(new Date(2026, 10, 1, 10, 0));
	});

	// Remove the picker and give the screen and the clock back
	afterEach(() => {
		wrapper?.unmount();
		window.matchMedia = originalMatchMedia;
		vi.useRealTimers();
	});

	// The date picker: a day picked closes it, and the field shows the date
	it('picks a date in a sheet on phones', async () => {
		wrapper = await mountSuspended(DatePicker, { props: { modelValue: null } });
		expect(wrapper.find('[data-slot="picker-field"]').text()).toBe('Pick a date');
		await wrapper.find('[data-slot="picker-field"]').trigger('click');
		await flushPromises();
		expect(sheet().dataset.mode).toBe('sheet');

		// Pick the 12th
		await tap(findDay(12));
		const [[picked]] = wrapper.emitted('update:modelValue');
		expect([picked.getFullYear(), picked.getMonth(), picked.getDate()]).toEqual([2026, 10, 12]);
		expect(sheet()).toBeNull();
	});

	// On a larger screen the date picker opens a popover under the field
	it('opens a popover on larger screens', async () => {
		isWideScreen = true;
		wrapper = await mountSuspended(DatePicker, { props: { modelValue: new Date(2026, 10, 6) } });
		expect(wrapper.find('[data-slot="picker-field"]').text()).toBe('November 6, 2026');
		await wrapper.find('[data-slot="picker-field"]').trigger('click');
		await flushPromises();
		expect(popover()).not.toBeNull();
		expect(sheet()).toBeNull();
	});

	// The time picker starts on noon when it has no value, and the wheels set the time as they turn
	it('starts the time picker on noon', async () => {
		wrapper = await mountSuspended(TimePicker, { props: { modelValue: '' } });
		expect(wrapper.find('[data-slot="picker-field"]').text()).toBe('Pick a time');
		await wrapper.find('[data-slot="picker-field"]').trigger('click');
		await flushPromises();
		expect(wrapper.emitted('update:modelValue')).toEqual([['12:00']]);
		expect(sheet().querySelector('[data-slot="time-wheel"]')).not.toBeNull();

		// Confirm closes it
		await tap(confirmButton());
		expect(sheet()).toBeNull();
	});

	// The date and time picker applies the pick with confirm, once it has a day
	it('applies a date and time with confirm', async () => {
		wrapper = await mountSuspended(DateTimePicker, { props: { modelValue: null } });
		await wrapper.find('[data-slot="picker-field"]').trigger('click');
		await flushPromises();
		expect(confirmButton().disabled).toBe(true); // No day yet

		// Pick the 20th and confirm (the time stays on noon)
		await tap(findDay(20));
		expect(confirmButton().disabled).toBe(false);
		await tap(confirmButton());
		const [[picked]] = wrapper.emitted('update:modelValue');
		expect([picked.getDate(), picked.getHours(), picked.getMinutes()]).toEqual([20, 12, 0]);
		expect(sheet()).toBeNull();
	});

	// A pick before the earliest date and time can't be applied, and closing without confirm changes nothing
	it('refuses a pick before the earliest time', async () => {
		wrapper = await mountSuspended(DateTimePicker, { props: { modelValue: null, minDate: new Date(2026, 10, 1, 15, 0) } });
		await wrapper.find('[data-slot="picker-field"]').trigger('click');
		await flushPromises();

		// Today at noon is before 15:00
		await tap(findDay(1));
		expect(confirmButton().disabled).toBe(true);
		await tap(sheet().querySelector('[aria-label="Close"]'));
		expect(wrapper.emitted('update:modelValue')).toBeUndefined();
	});
});