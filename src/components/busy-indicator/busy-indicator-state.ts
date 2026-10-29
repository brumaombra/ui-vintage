import { h, markRaw, reactive, render, type Component, type HTMLAttributes } from 'vue';
import { getUiVintageRuntimeMessage } from '../../lib/i18n';

export interface SetBusyOptions {
	label?: string;
	class?: HTMLAttributes['class'];
	overlayClass?: HTMLAttributes['class'];
	variant?: 'card' | 'fullscreen'; // A card over the dimmed page, or the whole screen
	mark?: Component | null; // Shown above the label on the whole screen instead of the spinner (e.g. the app's animated logo; it is rendered outside the app, so it must not need its plugins)
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

// Toggle the global busy overlay
export const setBusy = (show: boolean, options: SetBusyOptions = {}) => {
	// Prepare the overlay before showing it
	if (show) {
		busyIndicatorState.label = options.label ?? getUiVintageRuntimeMessage('uiVintage.common.loading.title', 'Loading...');
		busyIndicatorState.class = options.class;
		busyIndicatorState.overlayClass = options.overlayClass;
		busyIndicatorState.variant = options.variant ?? 'card';
		busyIndicatorState.mark = options.mark ? markRaw(options.mark) : null; // A component, not reactive data
		void ensureBusyIndicatorMounted();
	}

	// Toggle the overlay visibility
	busyIndicatorState.show = show;

	// Reset transient styling after hiding (the variant and the mark stay, so the whole screen can fade out)
	if (!show) {
		busyIndicatorState.class = undefined;
		busyIndicatorState.overlayClass = undefined;
	}
};