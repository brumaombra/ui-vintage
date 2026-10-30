// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { haptic, isHapticsSupported, setHapticsEnabled, useHaptics } from '../../../src/lib/haptics';

// Browser of an Android phone: it vibrates, and the user already tapped the page unless told otherwise
const stubAndroid = ({ hasBeenActive = true } = {}) => {
	const vibrate = vi.fn(() => true);
	vi.stubGlobal('navigator', { vibrate, userActivation: { hasBeenActive } });
	vi.stubGlobal('matchMedia', () => ({ matches: true }));
	return vibrate;
};

// Browser of an iPhone on iOS 18 or later: no vibration, but native switches (each toggle plays a tick)
const stubIos = () => {
	vi.stubGlobal('navigator', { userActivation: { hasBeenActive: true } });
	vi.stubGlobal('matchMedia', () => ({ matches: true }));
	Object.defineProperty(HTMLInputElement.prototype, 'switch', { configurable: true, get: () => false });
};

// Count the toggles of the hidden switch of the iOS taps (each toggle plays one tick)
const countSwitchToggles = () => {
	const toggles = vi.fn();
	document.addEventListener('change', event => {
		if (event.target.matches?.('input[switch]')) toggles();
	}, true);
	return toggles;
};

// Haptic feedback of the taps that matter
describe('haptics', () => {
	// Start each test enabled, with an empty page
	beforeEach(() => {
		setHapticsEnabled(true);
		document.body.innerHTML = '';
	});

	// Restore the browser and the timers
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.useRealTimers();
		delete HTMLInputElement.prototype.switch;
	});

	// Android vibrates a short pattern for each kind of feedback
	it('vibrates on Android', () => {
		const vibrate = stubAndroid();

		// Play the three patterns
		haptic('tap');
		haptic('success');
		haptic('error');

		// Expect a short tap, a double tap and a triple buzz
		expect(vibrate.mock.calls).toEqual([[10], [[10, 60, 10]], [[30, 50, 30, 50, 30]]]);
	});

	// Before the first tap Chrome ignores the vibration and logs a warning, so nothing is asked
	it('waits for the user to interact with the page', () => {
		const vibrate = stubAndroid({ hasBeenActive: false });

		// Expect no vibration
		haptic();
		expect(vibrate).not.toHaveBeenCalled();
	});

	// The app setting turns every feedback off, and back on
	it('follows the setting of the app', () => {
		const vibrate = stubAndroid();
		const { setEnabled, enabled } = useHaptics();

		// Expect nothing while disabled
		setEnabled(false);
		haptic();
		expect(vibrate).not.toHaveBeenCalled();
		expect(enabled.value).toBe(false);

		// Expect the tap again once enabled
		setEnabled(true);
		haptic();
		expect(vibrate).toHaveBeenCalledTimes(1);
	});

	// iOS has no vibration: the hidden switch is toggled once per tap of the pattern
	it('toggles a hidden switch on iOS', () => {
		stubIos();
		vi.useFakeTimers();
		const toggles = countSwitchToggles();

		// Expect the first tap at once, in the user action, and the second one of a success right after
		useHaptics().success();
		expect(toggles).toHaveBeenCalledTimes(1);
		vi.advanceTimersByTime(70);
		expect(toggles).toHaveBeenCalledTimes(2);

		// Expect a single switch, out of the tab order and hidden from screen readers
		const labels = document.body.querySelectorAll('label');
		expect(labels).toHaveLength(1);
		expect(labels[0].getAttribute('aria-hidden')).toBe('true');
		expect(labels[0].querySelector('input').hasAttribute('switch')).toBe(true);
		expect(labels[0].querySelector('input').tabIndex).toBe(-1);

		// Expect the same switch to be reused by the next tap
		haptic('tap');
		expect(document.body.querySelectorAll('label')).toHaveLength(1);
		expect(toggles).toHaveBeenCalledTimes(3);
	});

	// A desktop browser has neither: nothing happens and nothing is added to the page
	it('does nothing where haptics are not supported', () => {
		vi.stubGlobal('navigator', { userActivation: { hasBeenActive: true } });
		vi.stubGlobal('matchMedia', () => ({ matches: false }));

		// Expect no support, no error and no switch
		expect(isHapticsSupported()).toBe(false);
		expect(() => haptic('error')).not.toThrow();
		expect(document.body.querySelectorAll('label')).toHaveLength(0);
	});

	// Desktop Chrome has navigator.vibrate and Mac Safari native switches, but no motor: a settings page must not offer haptics there
	it('ignores the vibration API and the switches of desktop browsers', () => {
		const vibrate = vi.fn(() => true);
		vi.stubGlobal('navigator', { vibrate, userActivation: { hasBeenActive: true } });
		vi.stubGlobal('matchMedia', () => ({ matches: false }));
		Object.defineProperty(HTMLInputElement.prototype, 'switch', { configurable: true, get: () => false });

		// Expect no support, no vibration and no switch
		expect(isHapticsSupported()).toBe(false);
		haptic();
		expect(vibrate).not.toHaveBeenCalled();
		expect(document.body.querySelectorAll('label')).toHaveLength(0);
	});

	// Android and iOS report the support the components can check
	it('reports the support on Android and iOS', () => {
		stubAndroid();
		expect(isHapticsSupported()).toBe(true);
		vi.unstubAllGlobals();
		stubIos();
		expect(isHapticsSupported()).toBe(true);
	});
});