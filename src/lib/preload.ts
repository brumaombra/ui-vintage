// Load a lazily mounted component (the busy overlay, toasts, dialogs) while the browser is idle after the page loaded, so it shows at once on first use, even on a slow network (it used to wait for its file to download, after the action had started)
export const preloadWhenIdle = (loader: () => Promise<unknown>) => {
	// Browser only
	if (typeof window === 'undefined') return;

	// Load it when the browser has nothing else to do (or soon, where idle callbacks don't exist), ignoring failures: it's loaded again on first use
	const load = () => {
		const run = () => { loader().catch(() => {}); };
		if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 3000 });
		else setTimeout(run, 1500);
	};

	// After the page loaded, so it never competes with it
	if (document.readyState === 'complete') load();
	else window.addEventListener('load', load, { once: true });
};