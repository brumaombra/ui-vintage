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
});