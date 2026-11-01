import { defineNuxtPlugin, useHead } from 'nuxt/app';
import { buildIosFieldViewport } from '../lib/ios-viewport';

// Stop Safari zooming the page in when a field is tapped, without making the fields bigger: on iOS only, the viewport gets maximum-scale=1 (it replaces the default one of Nuxt, and a viewport an app plugin sets still wins, since app plugins run after the library ones)
export default defineNuxtPlugin(() => {
	const viewport = buildIosFieldViewport({ browser: navigator, viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content') });
	if (viewport) useHead({ meta: [{ name: 'viewport', content: viewport }] });
});