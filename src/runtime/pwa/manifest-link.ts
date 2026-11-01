import { defineNuxtPlugin, useHead, useRuntimeConfig } from 'nuxt/app';
import { computed } from 'vue';

// What the plugin reads from the public runtime config
interface ManifestConfig {
	path: string; // The manifest in the default language
	defaultLocale: string;
	locales: string[]; // Languages with a manifest of their own
}

// Link the manifest in the language of the page (on the server too, so the browser finds it at once and offers to install the app)
export default defineNuxtPlugin(nuxtApp => {
	const config = (useRuntimeConfig().public.uiVintagePwa as { manifest?: ManifestConfig | null })?.manifest;
	if (!config) return;

	// The language of the page (read when the head is written, since Vue I18n starts after this plugin; the default language without it)
	const href = computed(() => {
		const language = (nuxtApp.$i18n as { locale?: { value: string } } | undefined)?.locale?.value;
		return language && language !== config.defaultLocale && config.locales.includes(language) ? config.path.replace(/\.webmanifest$/, `.${language}.webmanifest`) : config.path;
	});
	useHead({ link: [{ rel: 'manifest', href }] });
});