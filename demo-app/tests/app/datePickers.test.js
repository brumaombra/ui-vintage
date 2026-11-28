import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { InlineDatePicker } from '@brumaombra/ui-vintage/inline-date-picker';
import { TimeWheel } from '@brumaombra/ui-vintage/time-wheel';

// The time on two wheels
describe('TimeWheel', () => {
	// Each wheel is a spinbutton with its value and name
	it('describes each wheel to screen readers', async () => {
		const wrapper = await mountSuspended(TimeWheel, { props: { modelValue: '18:05' } });
		const hours = wrapper.find('[data-slot="time-wheel-hours"]');
		const minutes = wrapper.find('[data-slot="time-wheel-minutes"]');
		expect(hours.attributes()).toMatchObject({ role: 'spinbutton', 'aria-label': 'Hours', 'aria-valuenow': '18', 'aria-valuetext': '18' });
		expect(minutes.attributes()).toMatchObject({ role: 'spinbutton', 'aria-label': 'Minutes', 'aria-valuenow': '5', 'aria-valuetext': '05' });
	});

	// The arrows move by one value, the page keys by three, home and end to the ends
	it.each([
		['hours', 'ArrowDown', '19:05'],
		['hours', 'ArrowUp', '17:05'],
		['hours', 'PageDown', '21:05'],
		['hours', 'End', '23:05'],
		['minutes', 'ArrowDown', '18:10'],
		['minutes', 'Home', '18:00']
	])('moves the %s with %s', async (wheel, key, expected) => {
		const wrapper = await mountSuspended(TimeWheel, { props: { modelValue: '18:05' } });
		await wrapper.find(`[data-slot="time-wheel-${wheel}"]`).trigger('keydown', { key });
		expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([expected]);
	});

	// The ends hold: no hour after 23, no minute before 00
	it('stops at the ends', async () => {
		const wrapper = await mountSuspended(TimeWheel, { props: { modelValue: '23:00' } });
		await wrapper.find('[data-slot="time-wheel-hours"]').trigger('keydown', { key: 'ArrowDown' });
		await wrapper.find('[data-slot="time-wheel-minutes"]').trigger('keydown', { key: 'ArrowUp' });
		expect(wrapper.emitted('update:modelValue')).toBeUndefined();
	});

	// The minutes follow the step, and a time off the step (23:59) keeps its minute instead of jumping
	it('keeps a minute off the step', async () => {
		const wrapper = await mountSuspended(TimeWheel, { props: { modelValue: '23:59', minuteStep: 15 } });
		const values = wrapper.findAll('[data-slot="time-wheel-minutes"] [data-value]').map(item => item.attributes('data-value'));
		expect(values).toEqual(['0', '15', '30', '45', '59']);
	});

	// A value can be tapped
	it('picks a tapped value', async () => {
		const wrapper = await mountSuspended(TimeWheel, { props: { modelValue: '18:05' } });
		await wrapper.find('[data-slot="time-wheel-hours"] [data-value="9"]').trigger('click');
		expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['09:05']);
	});
});

// The always open calendar, working with Dates
describe('InlineDatePicker', () => {
	// Find the trigger of a day of the month shown
	const findDay = (wrapper, day) => wrapper.findAll('[data-slot="calendar-cell-trigger"]').find(cell => cell.text() === String(day) && cell.attributes('data-outside-view') === undefined);

	// A picked day comes back as a Date at midnight
	it('picks a day as a Date', async () => {
		const wrapper = await mountSuspended(InlineDatePicker, { props: { modelValue: new Date(2026, 10, 6, 18, 30), locale: 'en' } });
		expect(findDay(wrapper, 6).attributes('data-selected')).toBeDefined();
		await findDay(wrapper, 12).trigger('click');
		const picked = wrapper.emitted('update:modelValue').at(-1)[0];
		expect([picked.getFullYear(), picked.getMonth(), picked.getDate(), picked.getHours(), picked.getMinutes()]).toEqual([2026, 10, 12, 0, 0]);
	});

	// The days before the first one allowed can't be picked
	it('disables the days before the minimum', async () => {
		const wrapper = await mountSuspended(InlineDatePicker, { props: { modelValue: new Date(2026, 10, 20), minDate: new Date(2026, 10, 10, 15, 0), locale: 'en' } });
		expect(findDay(wrapper, 9).attributes('data-disabled')).toBeDefined();
		expect(findDay(wrapper, 10).attributes('data-disabled')).toBeUndefined();
	});

	// Find a cell of the year or month grid by its text
	const findCell = (wrapper, kind, text) => wrapper.findAll(`[data-slot="inline-date-picker-${kind}"]`).find(cell => cell.text() === text);

	// A day years ahead used to take one tap per month: the title opens the years, then the months
	it('jumps to another year and month from the title', async () => {
		// Open the year grid from the title of November 2026
		const wrapper = await mountSuspended(InlineDatePicker, { props: { modelValue: new Date(2026, 10, 6), minDate: new Date(2026, 10, 1), locale: 'en' } });
		expect(wrapper.find('[data-slot="inline-date-picker-title"]').text()).toBe('November 2026');
		await wrapper.find('[data-slot="inline-date-picker-title"]').trigger('click');

		// Expect the page to start at the minimum's year, with the year shown picked
		const years = wrapper.findAll('[data-slot="inline-date-picker-year"]').map(cell => cell.text());
		expect(years).toEqual(Array.from({ length: 12 }, (_, index) => String(2026 + index)));
		expect(findCell(wrapper, 'year', '2026').attributes('data-current')).toBeDefined();

		// Go to the next page, and pick 2041
		await wrapper.findAll('[data-slot="inline-date-picker-grid"] nav button')[1].trigger('click');
		await findCell(wrapper, 'year', '2041').trigger('click');

		// Pick March in the month grid
		expect(wrapper.find('[data-slot="inline-date-picker"]').attributes('data-view')).toBe('months');
		await findCell(wrapper, 'month', 'Mar').trigger('click');

		// Expect the days of March 2041, and a picked day there to come back as a Date
		expect(wrapper.find('[data-slot="inline-date-picker"]').attributes('data-view')).toBe('days');
		expect(wrapper.find('[data-slot="inline-date-picker-title"]').text()).toBe('March 2041');
		await findDay(wrapper, 15).trigger('click');
		const picked = wrapper.emitted('update:modelValue').at(-1)[0];
		expect([picked.getFullYear(), picked.getMonth(), picked.getDate()]).toEqual([2041, 2, 15]);
	});

	// The years and months outside the limits can't be picked, and the arrows stop at them
	it('disables the years and months outside the limits', async () => {
		// Open the year grid of a calendar limited from November 2026 to February 2028
		const wrapper = await mountSuspended(InlineDatePicker, { props: { modelValue: new Date(2026, 10, 20), minDate: new Date(2026, 10, 10), maxDate: new Date(2028, 1, 15), locale: 'en' } });
		await wrapper.find('[data-slot="inline-date-picker-title"]').trigger('click');

		// Expect only 2026 to 2028 to be enabled, and no page before or after
		expect(findCell(wrapper, 'year', '2028').attributes('disabled')).toBeUndefined();
		expect(findCell(wrapper, 'year', '2029').attributes('disabled')).toBeDefined();
		const [previousButton, nextButton] = wrapper.findAll('[data-slot="inline-date-picker-grid"] nav button');
		expect(previousButton.attributes('disabled')).toBeDefined();
		expect(nextButton.attributes('disabled')).toBeDefined();

		// Expect only January and February of 2028 to be enabled
		await findCell(wrapper, 'year', '2028').trigger('click');
		expect(findCell(wrapper, 'month', 'Feb').attributes('disabled')).toBeUndefined();
		expect(findCell(wrapper, 'month', 'Mar').attributes('disabled')).toBeDefined();

		// Expect the month kept from November to move inside the limit (February)
		expect(findCell(wrapper, 'month', 'Feb').attributes('data-current')).toBeDefined();
	});

	// Without a minimum (a birthday), the page ends at the maximum's year
	it('ends the first page at the maximum without a minimum', async () => {
		// Open the year grid of a calendar that stops at the end of 2026
		const wrapper = await mountSuspended(InlineDatePicker, { props: { modelValue: new Date(2000, 5, 1), maxDate: new Date(2026, 11, 31), locale: 'en' } });
		await wrapper.find('[data-slot="inline-date-picker-title"]').trigger('click');

		// Expect the page of 2000 to line up with 2026 as a last year (1991 to 2002)
		const years = wrapper.findAll('[data-slot="inline-date-picker-year"]').map(cell => cell.text());
		expect(years[0]).toBe('1991');
		expect(years.at(-1)).toBe('2002');
	});

	// A day picked from outside (a quick pick) brings the days back
	it('shows the days again when the value changes from outside', async () => {
		// Open the year grid, then set another day
		const wrapper = await mountSuspended(InlineDatePicker, { props: { modelValue: new Date(2026, 10, 6), locale: 'en' } });
		await wrapper.find('[data-slot="inline-date-picker-title"]').trigger('click');
		await wrapper.setProps({ modelValue: new Date(2026, 11, 31) });

		// Expect the days of December 2026
		expect(wrapper.find('[data-slot="inline-date-picker"]').attributes('data-view')).toBe('days');
		expect(wrapper.find('[data-slot="inline-date-picker-title"]').text()).toBe('December 2026');
	});
});