import en from '@/i18n/en.json';
import it from '@/i18n/it.json';

// The list of translation files
export const uiVintageMessages = {
    en,
    it
} as const;

// The type of the available locales based on the keys of the messages object
type UiVintageLocale = keyof typeof uiVintageMessages;

// Get the messages for a specific locale
export const getUiVintageMessagesForLocale = (locale: keyof typeof uiVintageMessages) => {
    return uiVintageMessages[locale];
};

// Resolve the current runtime locale from the document or navigator
const getUiVintageRuntimeLocale = (): UiVintageLocale => {
    let browserLocale = 'en';

    // Try to detect the user's locale from the document or navigator
    if (typeof document !== 'undefined' && document.documentElement.lang) {
        browserLocale = document.documentElement.lang;
    } else if (typeof navigator !== 'undefined' && navigator.language) {
        browserLocale = navigator.language;
    }

    // Default to English if the detected locale is not supported, otherwise use it
    if (browserLocale.toLowerCase().startsWith('it')) {
        return 'it';
    }

    // Fallback to English for unsupported or undetectable locales
    return 'en';
};

// Read a message from the bundled library locales with a safe fallback
export const getUiVintageRuntimeMessage = (path: string, fallback: string) => {
    const localeMessages = uiVintageMessages[getUiVintageRuntimeLocale()];
    const segments = path.split('.');
    let currentValue: unknown = localeMessages;

    // Traverse the nested message object based on the path segments
    for (const segment of segments) {
        // If the current value is not an object or doesn't contain the segment, return the fallback
        if (!currentValue || typeof currentValue !== 'object' || !(segment in currentValue)) {
            return fallback;
        }

        // Move deeper into the nested structure
        currentValue = (currentValue as Record<string, unknown>)[segment];
    }

    // If the final value is a string, return it; otherwise, return the fallback
    return typeof currentValue === 'string' ? currentValue : fallback;
};