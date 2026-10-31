import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { NumberField } from '@brumaombra/ui-vintage/number-field';
import { Switch } from '@brumaombra/ui-vintage/switch';
import { TimeWheel } from '@brumaombra/ui-vintage/time-wheel';

// Browser of an Android phone the user already tapped: it vibrates, on a touch screen
let vibrate;
const originalMatchMedia = window.matchMedia;
beforeEach(() => {
	vibrate = vi.fn(() => true);
	Object.defineProperty(navigator, 'vibrate', { configurable: true, value: vibrate });
	Object.defineProperty(navigator, 'userActivation', { configurable: true, value: { hasBeenActive: true } });
	window.matchMedia = query => ({ matches: query.includes('coarse'), media: query, addEventListener() {}, removeEventListener() {} });
});

// Restore the browser
afterEach(() => {
	delete navigator.vibrate;
	delete navigator.userActivation;
	window.matchMedia = originalMatchMedia;
});

// The switch taps on each flip by the user
describe('Switch haptic', () => {
	// A flip plays a light tap
	it('taps when the user flips it', async () => {
		const wrapper = await mountSuspended(Switch, { props: { modelValue: false } });
		await wrapper.find('[data-slot="switch"]').trigger('click');
		expect(vibrate.mock.calls).toEqual([[25]]);
	});

	// A value set by the page is not a flip of the user
	it('stays still when the value comes from the page', async () => {
		const wrapper = await mountSuspended(Switch, { props: { modelValue: false } });
		await wrapper.setProps({ modelValue: true });
		expect(vibrate).not.toHaveBeenCalled();
	});

	// The prop turns it off
	it('stays still with haptic off', async () => {
		const wrapper = await mountSuspended(Switch, { props: { modelValue: false, haptic: false } });
		await wrapper.find('[data-slot="switch"]').trigger('click');
		expect(vibrate).not.toHaveBeenCalled();
	});
});

// The number field taps at each step of its buttons
describe('NumberField haptic', () => {
	// Press a button and release it anywhere on the page
	const press = async (wrapper, slot) => {
		await wrapper.find(`[data-slot="${slot}"]`).trigger('pointerdown', { button: 0 });
		window.dispatchEvent(new Event('pointerup'));
	};

	// Each step of the - and + buttons plays a light tap
	it('taps at each step of the buttons', async () => {
		const wrapper = await mountSuspended(NumberField, { props: { modelValue: 5 } });
		await press(wrapper, 'number-field-increment');
		await press(wrapper, 'number-field-decrement');
		expect(wrapper.emitted('update:modelValue')).toEqual([[6], [4]]); // Not bound with v-model, so both steps start from 5
		expect(vibrate.mock.calls).toEqual([[25], [25]]);
	});

	// A button at its bound changes nothing, so it stays still
	it('stays still at the bound', async () => {
		const wrapper = await mountSuspended(NumberField, { props: { modelValue: 5, max: 5 } });
		await press(wrapper, 'number-field-increment');
		expect(vibrate).not.toHaveBeenCalled();
	});

	// A typed value is not a step of the buttons
	it('stays still for a typed value', async () => {
		const wrapper = await mountSuspended(NumberField, { props: { modelValue: 5 } });
		const input = wrapper.find('input');
		await input.setValue('8');
		await input.trigger('blur');
		expect(wrapper.emitted('update:modelValue')).toEqual([[8]]);
		expect(vibrate).not.toHaveBeenCalled();
	});

	// The prop turns it off
	it('stays still with haptic off', async () => {
		const wrapper = await mountSuspended(NumberField, { props: { modelValue: 5, haptic: false } });
		await press(wrapper, 'number-field-increment');
		expect(wrapper.emitted('update:modelValue')).toEqual([[6]]);
		expect(vibrate).not.toHaveBeenCalled();
	});
});

// The time wheel taps at each value that reaches the band
describe('TimeWheel haptic', () => {
	// Scroll a column to a row, as a finger would
	const scrollTo = async (column, row) => {
		column.element.scrollTop = row * 40;
		await column.trigger('scroll');
	};

	// Wait for the scroll of the mount to end, so the next scrolls are the user's
	const mountWheel = async props => {
		const wrapper = await mountSuspended(TimeWheel, { props: { modelValue: '18:05', ...props } });
		await new Promise(resolve => setTimeout(resolve, 60));
		return wrapper;
	};

	// Each value scrolled through the band ticks once, and a scroll inside the same row does not
	it('ticks at each value scrolled through the band', async () => {
		const wrapper = await mountWheel();
		const hours = wrapper.find('[data-slot="time-wheel-hours"]');
		await scrollTo(hours, 19);
		await scrollTo(hours, 19.2);
		await scrollTo(hours, 20);
		expect(vibrate).toHaveBeenCalledTimes(2);
	});

	// A tap on a value and an arrow key tick, a tap on the value already picked does not
	it('ticks on a tap and a key', async () => {
		const wrapper = await mountWheel();
		await wrapper.find('[data-slot="time-wheel-hours"] [data-value="18"]').trigger('click');
		await wrapper.find('[data-slot="time-wheel-hours"] [data-value="9"]').trigger('click');
		await wrapper.find('[data-slot="time-wheel-minutes"]').trigger('keydown', { key: 'ArrowDown' });
		expect(vibrate).toHaveBeenCalledTimes(2);
	});

	// A key at the end of a column changes nothing, so it stays still
	it('stays still at the end of a column', async () => {
		const wrapper = await mountWheel({ modelValue: '23:00' });
		await wrapper.find('[data-slot="time-wheel-hours"]').trigger('keydown', { key: 'End' });
		expect(vibrate).not.toHaveBeenCalled();
	});

	// The prop turns it off
	it('stays still with haptic off', async () => {
		const wrapper = await mountWheel({ haptic: false });
		await scrollTo(wrapper.find('[data-slot="time-wheel-hours"]'), 20);
		await wrapper.find('[data-slot="time-wheel-hours"] [data-value="9"]').trigger('click');
		expect(vibrate).not.toHaveBeenCalled();
	});
});