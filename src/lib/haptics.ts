import { readonly, ref } from 'vue';

// Kinds of haptic feedback: a light tap (toggles, steps), a success (an action that went through) and an error (an action refused)
export type HapticPattern = 'tap' | 'success' | 'error';

// Vibration of each pattern on Android, in milliseconds (vibrate, pause, vibrate...)
const VIBRATION_PATTERNS: Record<HapticPattern, number | number[]> = {
	tap: 10,
	success: [10, 60, 10],
	error: [30, 50, 30, 50, 30]
};

// Taps of each pattern on iOS, where every toggle of a native switch plays one tick of the Taptic Engine
const SWITCH_TAPS: Record<HapticPattern, number> = {
	tap: 1,
	success: 2,
	error: 3
};

// Pause between two taps on iOS, in milliseconds
const SWITCH_TAP_INTERVAL_MS = 70;

// Whether the app lets the haptics play (an app setting, shared by every caller of the page)
const enabled = ref(true);

// Hidden native switch whose toggles play the iOS taps (created on the first tap)
let hapticSwitchLabel: HTMLLabelElement | null = null;

// Check if the device has a touch screen (desktop Chrome also has navigator.vibrate and Mac Safari native switches, but neither has a motor to play them)
const hasTouchScreen = () => typeof matchMedia === 'function' && matchMedia('(any-pointer: coarse)').matches;

// Check if the browser vibrates (Android)
const canVibrate = () => typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';

// Check if the browser has native switches, which iOS 18 and later make tick when toggled (Safari has no vibration)
const canToggleSwitch = () => typeof document !== 'undefined' && 'switch' in document.createElement('input');

// Check if the user already interacted with the page (browsers ignore haptics before that, and Chrome logs a warning)
const hasUserActivation = () => typeof navigator === 'undefined' || !navigator.userActivation || navigator.userActivation.hasBeenActive;

// Get the hidden switch of the iOS taps, creating it once (out of sight, of the tab order and of screen readers, but still clickable)
const getHapticSwitchLabel = () => {
	if (hapticSwitchLabel?.isConnected) return hapticSwitchLabel;

	// Build the switch inside its label (clicking the label toggles it, as a tap would)
	const input = document.createElement('input');
	input.type = 'checkbox';
	input.setAttribute('switch', '');
	input.tabIndex = -1;
	hapticSwitchLabel = document.createElement('label');
	hapticSwitchLabel.setAttribute('aria-hidden', 'true');
	hapticSwitchLabel.style.cssText = 'position:fixed;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;';
	hapticSwitchLabel.append(input);
	document.body.append(hapticSwitchLabel);

	// Return the label
	return hapticSwitchLabel;
};

// Check if the device can play haptics (Android, or iOS 18 and later)
export const isHapticsSupported = () => hasTouchScreen() && (canVibrate() || canToggleSwitch());

// Let the haptics play or not (for example from a setting of the user)
export const setHapticsEnabled = (isEnabled: boolean) => {
	enabled.value = isEnabled;
};

// Play a haptic feedback; call it in the handler of the user's tap, since iOS only plays the taps of a user action (it does nothing on the server, on desktop and when disabled)
export const haptic = (pattern: HapticPattern = 'tap') => {
	if (!enabled.value || !hasUserActivation() || !hasTouchScreen()) return;

	// Vibrate on Android
	if (canVibrate()) {
		navigator.vibrate(VIBRATION_PATTERNS[pattern]);
		return;
	}

	// Toggle the hidden switch on iOS, once per tap of the pattern (the first one plays within the user action, the next ones are best effort)
	if (canToggleSwitch()) {
		const label = getHapticSwitchLabel();
		for (let index = 0; index < SWITCH_TAPS[pattern]; index++) {
			if (index === 0) {
				label.click();
			} else {
				setTimeout(() => label.click(), index * SWITCH_TAP_INTERVAL_MS);
			}
		}
	}
};

// Haptic feedback for components and pages: the three patterns, the support and the setting
export const useHaptics = () => ({
	tap: () => haptic('tap'),
	success: () => haptic('success'),
	error: () => haptic('error'),
	isSupported: isHapticsSupported,
	enabled: readonly(enabled),
	setEnabled: setHapticsEnabled
});