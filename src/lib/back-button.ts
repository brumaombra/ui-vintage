import { onBeforeUnmount, toValue, watch } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

// What the library needs from the router of the app: the switch that makes it ignore the browser's back and forward
interface BackButtonRouter {
	listening: boolean;
}

// An open dialog that the back button closes: the id of its history entry, and how to close it
interface BackEntry {
	id: number;
	close: () => void;
}

// Open dialogs, the newest last
const entries: BackEntry[] = [];
let router: BackButtonRouter | null = null;
let nextId = 0;
let listening = false;
let ownPops = 0; // Back steps the library takes itself (a dialog closed in the app removes its history entry)

// Let the app's router hand over the history while a dialog is open (set by the module's plugin)
export const setBackButtonRouter = (appRouter: BackButtonRouter | null) => {
	router = appRouter;
};

// Touch screens only: that's where the back button of the phone (or the swipe back) closes things, like in native apps
const isTouchScreen = () => typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches === true;

// The id of the dialog entry the browser is on now (0 for the page itself)
const currentEntryId = () => (window.history.state?.uvBack as number | undefined) || 0;

// Give the history back to the router once no dialog is open
const releaseRouter = () => {
	if (!entries.length && router) router.listening = true;
};

// The browser went back (or forward): close the dialogs whose entry is no longer the current one, newest first
const handlePopState = () => {
	if (ownPops > 0) {
		ownPops--;
		releaseRouter();
		return;
	}
	const current = currentEntryId();
	while (entries.length && entries[entries.length - 1]!.id > current) {
		entries.pop()!.close();
	}
	releaseRouter();
};

// A dialog opened: add a history entry for it (same address, so nothing visible changes), so the back button closes it instead of leaving the page
export const openBackEntry = (close: () => void) => {
	if (!isTouchScreen()) return null;
	if (!listening) {
		window.addEventListener('popstate', handlePopState);
		listening = true;
	}
	const id = ++nextId;
	entries.push({ id, close });
	if (router) router.listening = false;
	window.history.pushState({ ...window.history.state, uvBack: id }, '');
	return id;
};

// A dialog closed in the app (its ✕, a button, Escape, a tap outside): remove its history entry when the browser is still on it, so the back button doesn't have to be pressed twice
export const closeBackEntry = (id: number | null) => {
	const index = entries.findIndex(entry => entry.id === id);
	if (index === -1) return; // Already closed by the back button
	entries.splice(index, 1);
	if (currentEntryId() === id) {
		ownPops++;
		window.history.back();
	} else {
		releaseRouter(); // A link in the dialog already moved to another page: its entry stays behind it, harmless
	}
};

// Close a dialog with the back button of the phone while it's open
export const useBackButtonClose = ({ open, close }: { open: MaybeRefOrGetter<boolean>; close: () => void }) => {
	let id: number | null = null;

	// Add the entry when it opens, and remove it when it closes
	watch(() => toValue(open), isOpen => {
		if (isOpen && id === null) {
			id = openBackEntry(close);
		} else if (!isOpen && id !== null) {
			closeBackEntry(id);
			id = null;
		}
	}, { immediate: true });

	// A dialog removed while open (its page changed, for example) gives its entry back too
	onBeforeUnmount(() => {
		if (id !== null) closeBackEntry(id);
		id = null;
	});
};