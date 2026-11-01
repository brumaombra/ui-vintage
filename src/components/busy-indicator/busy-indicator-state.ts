import { h, markRaw, reactive, render, type Component, type HTMLAttributes } from 'vue';
import { getUiVintageRuntimeMessage } from '../../lib/i18n';
import { preloadWhenIdle } from '../../lib/preload';

export interface SetBusyOptions {
	label?: string;
	class?: HTMLAttributes['class'];
	overlayClass?: HTMLAttributes['class'];
	variant?: 'card' | 'fullscreen'; // A card over the dimmed page, or the whole screen
	mark?: Component | null; // Shown above the label on the whole screen instead of the spinner (e.g. the app's animated logo; it is rendered outside the app, so it must not need its plugins)
	minDuration?: number; // Milliseconds it stays up at least, even when the work ends sooner (e.g. one full cycle of the mark's animation, so it never just flickers)
}

interface BusyIndicatorState {
	show: boolean;
	label: string;
	class: HTMLAttributes['class'];
	overlayClass: HTMLAttributes['class'];
	variant: 'card' | 'fullscreen';
	mark: Component | null;
}

const BUSY_INDICATOR_ROOT_ID = 'ui-vintage-busy-indicator-root';

let busyIndicatorMountPromise: Promise<void> | null = null;

// Shared busy state
export const busyIndicatorState: BusyIndicatorState = reactive({
	show: false,
	label: getUiVintageRuntimeMessage('uiVintage.common.loading.title', 'Loading...'),
	class: undefined,
	overlayClass: undefined,
	variant: 'card',
	mark: null
});

// Mount the busy indicator once on demand
const ensureBusyIndicatorMounted = () => {
	// Skip mounting during SSR
	if (typeof document === 'undefined') {
		return Promise.resolve();
	}

	// Reuse the existing mount root
	const existingRoot = document.getElementById(BUSY_INDICATOR_ROOT_ID);
	if (existingRoot) {
		return Promise.resolve();
	}

	// Reuse the in-flight mount
	if (busyIndicatorMountPromise) {
		return busyIndicatorMountPromise;
	}

	// Start the lazy mount
	busyIndicatorMountPromise = (async () => {
		// Load the component only when needed
		const { default: BusyIndicator } = await import('./BusyIndicator.vue');

		// Guard against a concurrent mount
		if (document.getElementById(BUSY_INDICATOR_ROOT_ID)) {
			return;
		}

		// Create the host element and render the component
		const container = document.createElement('div');
		container.id = BUSY_INDICATOR_ROOT_ID;
		document.body.appendChild(container);
		render(h(BusyIndicator), container);
	})().finally(() => {
		busyIndicatorMountPromise = null;
	});

	// Let callers await the mount
	return busyIndicatorMountPromise;
};

// When the overlay was shown and how long it must stay up, and the hide waiting for that time
let shownAt = 0;
let minDuration = 0;
let pendingHide: ReturnType<typeof setTimeout> | null = null;
let pendingHideDone: (() => void) | null = null;

// Hide the overlay now
const hideBusy = () => {
	busyIndicatorState.show = false;

	// Reset transient styling after hiding (the variant and the mark stay, so the whole screen can fade out)
	busyIndicatorState.class = undefined;
	busyIndicatorState.overlayClass = undefined;
};

// Forget a hide that was waiting (shown again before it ran), and let whoever awaited it go on
const cancelPendingHide = () => {
	if (pendingHide) clearTimeout(pendingHide);
	pendingHide = null;
	pendingHideDone?.();
	pendingHideDone = null;
};

// Toggle the global busy overlay (hiding resolves once it's hidden: right away, or when its minimum duration has passed)
export const setBusy = (show: boolean, options: SetBusyOptions = {}): Promise<void> => {
	// Hide it, now or once it has been up for its minimum duration
	if (!show) {
		cancelPendingHide();
		const remaining = minDuration - (Date.now() - shownAt);
		if (!busyIndicatorState.show || remaining <= 0) {
			hideBusy();
			return Promise.resolve();
		}
		return new Promise(resolve => {
			pendingHideDone = resolve;
			pendingHide = setTimeout(() => {
				pendingHide = null;
				pendingHideDone = null;
				hideBusy();
				resolve();
			}, remaining);
		});
	}

	// Shown again while a hide waited: it stays up, with the new options
	cancelPendingHide();
	if (!busyIndicatorState.show) shownAt = Date.now();
	minDuration = Math.max(0, options.minDuration ?? 0);

	// Prepare the overlay, then show it
	busyIndicatorState.label = options.label ?? getUiVintageRuntimeMessage('uiVintage.common.loading.title', 'Loading...');
	busyIndicatorState.class = options.class;
	busyIndicatorState.overlayClass = options.overlayClass;
	busyIndicatorState.variant = options.variant ?? 'card';
	busyIndicatorState.mark = options.mark ? markRaw(options.mark) : null; // A component, not reactive data
	void ensureBusyIndicatorMounted();
	busyIndicatorState.show = true;
	return Promise.resolve();
};

// Load the component in the background once the page is idle, so it shows at once on first use
preloadWhenIdle(() => import('./BusyIndicator.vue'));