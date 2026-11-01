import { h, render } from 'vue';
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app';

// What the plugin reads from the public runtime config
interface PwaPublicConfig {
	enabled: boolean; // Production builds only (in development it would keep old files while editing)
	path: string;
	scope: string;
	selfDestroy: boolean;
	offlineIndicator: boolean; // Show a pill at the top when the connection drops
}

// Show the connection pill (loaded once the app is running, so it doesn't weigh on the first load)
const mountOfflineIndicator = async () => {
	const { default: OfflineIndicator } = await import('./OfflineIndicator.vue');
	const container = document.createElement('div');
	container.id = 'ui-vintage-offline-indicator-root';
	document.body.appendChild(container);
	render(h(OfflineIndicator), container);
};

// Register the service worker of the app, or let the one already installed remove itself, and show when the connection drops
export default defineNuxtPlugin(nuxtApp => {
	const config = useRuntimeConfig().public.uiVintagePwa as PwaPublicConfig;
	if (!config) return;

	// The connection pill (in development too: it's only interface)
	if (config.offlineIndicator) nuxtApp.hook('app:mounted', () => { mountOfflineIndicator().catch(() => {}); });

	// The service worker: production builds only
	if (!config.enabled || !('serviceWorker' in navigator)) return;

	// Removal: devices that have it fetch the new one, which deletes its caches and unregisters (new visitors get none)
	if (config.selfDestroy) {
		navigator.serviceWorker.getRegistration(config.scope).then(registration => registration?.update()).catch(() => {});
		return;
	}

	// Register once the page has loaded, so it doesn't compete with it (the browser always fetches the latest one)
	const register = () => {
		navigator.serviceWorker.register(config.path, { scope: config.scope, updateViaCache: 'none' }).catch(() => {});
	};
	if (document.readyState === 'complete') register();
	else window.addEventListener('load', register, { once: true });
});
