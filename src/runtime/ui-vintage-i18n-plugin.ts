import { defineNuxtPlugin } from 'nuxt/app';
import type { NuxtApp } from 'nuxt/app';
import { uiVintageMessages } from '../lib/i18n';

type MessageComposer = {
    mergeLocaleMessage: (locale: string, messages: unknown) => void;
};

type I18nInstance = {
    mergeLocaleMessage?: unknown;
    global?: {
        mergeLocaleMessage?: unknown;
    };
};

type NuxtAppWithI18n = NuxtApp & {
    $i18n?: unknown;
};

// Resolve the active i18n composer from either the Nuxt app or the Vue I18n instance
const resolveMessageComposer = (i18n: unknown): MessageComposer | null => {
    // If no i18n instance is provided, return null
    if (!i18n || typeof i18n !== 'object') {
        return null;
    }

    const instance = i18n as I18nInstance;

    // Check if the provided i18n instance has the mergeLocaleMessage method (Vue I18n 9+ composer API)
    if (typeof instance.mergeLocaleMessage === 'function') {
        return i18n as MessageComposer;
    }

    // Check if the provided i18n instance has a global property with the mergeLocaleMessage method (Vue I18n 9+ global API)
    if (instance.global && typeof instance.global.mergeLocaleMessage === 'function') {
        return instance.global as MessageComposer;
    }

    // If neither check succeeded, return null
    return null;
};

// Merge the library locale messages into the app composer
const applyUiVintageMessages = (nuxtApp: NuxtApp): void => {
    // Attempt to resolve the i18n composer from the Nuxt app or Vue I18n instance
    const app = nuxtApp as NuxtAppWithI18n;
    const globalProperties = app.vueApp.config.globalProperties as {
        $i18n?: unknown;
    };
    const composer = resolveMessageComposer(app.$i18n || globalProperties.$i18n);
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