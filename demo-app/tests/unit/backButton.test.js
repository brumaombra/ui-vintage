// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// A browser history: entries with their states, back() fires popstate like a browser does
const createHistory = () => {
	const states = [{ position: 0 }];
	let index = 0;
	return {
		get state() { return states[index]; },
		get length() { return states.length; },
		pushState: state => { states.splice(index + 1); states.push(state); index++; },
		back: () => { index--; window.dispatchEvent(new PopStateEvent('popstate', { state: states[index] })); }
	};
};

// A fresh copy of the module for each test (it keeps the open dialogs), on a touch screen with the app's router
let back;
let history;
let router;
beforeEach(async () => {
	vi.resetModules();
	history = createHistory();
	Object.defineProperty(window, 'history', { value: history, configurable: true });
	window.matchMedia = () => ({ matches: true });
	back = await import('../../../src/lib/back-button');
	router = { listening: true };
	back.setBackButtonRouter(router);
});
afterEach(() => { vi.restoreAllMocks(); });

// The back button of the phone closes dialogs and sheets, like in native apps
describe('back button', () => {
	// Opening adds an entry on the same page (the router stops reacting to back), and back closes the dialog and gives the router back
	it('closes the open dialog on back', () => {
		const close = vi.fn();
		back.openBackEntry(close);
		expect(history.length).toBe(2);
		expect(router.listening).toBe(false);
		history.back();
		expect(close).toHaveBeenCalledTimes(1);
		expect(router.listening).toBe(true);
	});

	// A dialog closed in the app removes its entry, so the next back leaves the page instead of doing nothing
	it('removes the entry of a dialog closed in the app', () => {
		const close = vi.fn();
		const id = back.openBackEntry(close);
		back.closeBackEntry(id);
		expect(history.state.uvBack).toBeUndefined();
		expect(close).not.toHaveBeenCalled(); // It was already closed
		expect(router.listening).toBe(true);
	});

	// Two dialogs open (a confirmation over a sheet): back closes the top one only
	it('closes only the dialog on top', () => {
		const closeSheet = vi.fn();
		const closeConfirm = vi.fn();
		back.openBackEntry(closeSheet);
		back.openBackEntry(closeConfirm);
		history.back();
		expect(closeConfirm).toHaveBeenCalledTimes(1);
		expect(closeSheet).not.toHaveBeenCalled();
		expect(router.listening).toBe(false); // The sheet is still open
		history.back();
		expect(closeSheet).toHaveBeenCalledTimes(1);
		expect(router.listening).toBe(true);
	});

	// A link in the dialog moved to another page: its entry stays behind the new page, and the router gets the history back
	it('leaves the history alone when a link already moved on', () => {
		const id = back.openBackEntry(vi.fn());
		history.pushState({ position: 1 }); // The router's new page
		back.closeBackEntry(id);
		expect(history.length).toBe(3);
		expect(router.listening).toBe(true);
	});

	// Mouse screens have no back gesture for dialogs: nothing is added
	it('does nothing without a touch screen', () => {
		window.matchMedia = () => ({ matches: false });
		expect(back.openBackEntry(vi.fn())).toBeNull();
		expect(history.length).toBe(1);
	});
});