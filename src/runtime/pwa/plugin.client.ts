import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app';

// What the plugin reads from the public runtime config
interface PwaPublicConfig {
	enabled: boolean; // Production builds only (in development it would keep old files while editing)
	path: string;
	scope: string;
	selfDestroy: boolean;
}

// Register the service worker of the app, or let the one already installed remove itself
export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig().public.uiVintagePwa as PwaPublicConfig;
	if (!config) return;

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
