import { uiVintageMessages } from '@brumaombra/ui-vintage/i18n';

// Check if a value is a plain object that can be merged recursively
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

// Merge library defaults with app-level overrides
const mergeMessages = (defaults, overrides) => {
    // If either is not an object, return the override or default
    if (!isObject(defaults) || !isObject(overrides)) {
        return overrides ?? defaults;
    }

    // Start with the defaults
    const merged = { ...defaults };

    // Merge nested translation objects while preserving app overrides
    Object.keys(overrides).forEach(key => {
        merged[key] = key in defaults ? mergeMessages(defaults[key], overrides[key]) : overrides[key];
    });

    // Return the merged translations
    return merged;
};

// Plugin to register ui-vintage default translations into the app i18n instance
export default defineNuxtPlugin(nuxtApp => {
    const i18n = nuxtApp.$i18n;

    // Merge library defaults first so app locale files can still override them
    Object.entries(uiVintageMessages).forEach(([locale, defaults]) => {
        const currentMessages = i18n.getLocaleMessage(locale) || {};
        i18n.setLocaleMessage(locale, mergeMessages(defaults, currentMessages));
    });
});