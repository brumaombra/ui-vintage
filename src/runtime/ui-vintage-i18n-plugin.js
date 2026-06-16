import { defineNuxtPlugin } from 'nuxt/app';
import { uiVintageMessages } from '../lib/i18n';

// Resolve the active i18n composer from either the Nuxt app or the Vue I18n instance
const resolveMessageComposer = i18n => {
    // If no i18n instance is provided, return null
    if (!i18n) {
        return null;
    }

    // Check if the provided i18n instance has the mergeLocaleMessage method (Vue I18n 9+ composer API)
    if (typeof i18n.mergeLocaleMessage === 'function') {
        return i18n;
    }

    // Check if the provided i18n instance has a global property with the mergeLocaleMessage method (Vue I18n 9+ global API)
    if (i18n.global && typeof i18n.global.mergeLocaleMessage === 'function') {
        return i18n.global;
    }

    // If neither check succeeded, return null
    return null;
};

// Merge the library locale messages into the app composer
const applyUiVintageMessages = nuxtApp => {
    // Attempt to resolve the i18n composer from the Nuxt app or Vue I18n instance
    const composer = resolveMessageComposer(nuxtApp.$i18n || nuxtApp.vueApp?.config?.globalProperties?.$i18n);
    if (!composer) {
        return;
    }

    // Merge the library messages into the composer
    for (const [locale, messages] of Object.entries(uiVintageMessages)) {
        composer.mergeLocaleMessage(locale, messages);
    }
};

// Define the Nuxt plugin
export default defineNuxtPlugin({
    name: 'ui-vintage:i18n',
    dependsOn: ['i18n:plugin'],
    setup(nuxtApp) {
        // Merge library messages during plugin setup and after app creation
        applyUiVintageMessages(nuxtApp);
        nuxtApp.hook('app:created', () => applyUiVintageMessages(nuxtApp));
    }
});