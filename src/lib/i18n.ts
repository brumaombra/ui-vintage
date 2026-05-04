import en from '@/i18n/en.json';
import fr from '@/i18n/fr.json';
import de from '@/i18n/de.json';
import es from '@/i18n/es.json';
import it from '@/i18n/it.json';
import ja from '@/i18n/ja.json';
import ru from '@/i18n/ru.json';
import zh from '@/i18n/zh.json';

// The list of translation files
export const uiVintageMessages = {
    en,
    it,
    fr,
    es,
    de,
    zh,
    ja,
    ru
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
    if (typeof document !== 'undefined' && document.documentElement?.lang) {
        browserLocale = document.documentElement.lang?.toLowerCase();
    } else if (typeof navigator !== 'undefined' && navigator.language) {
        browserLocale = navigator.language?.toLowerCase();
    }

    // Default to English if the detected locale is not supported, otherwise use it
    if (browserLocale.startsWith('it')) {
        return 'it';
    } else if (browserLocale.startsWith('fr')) {
        return 'fr';
    } else if (browserLocale.startsWith('es')) {
        return 'es';
    } else if (browserLocale.startsWith('de')) {
        return 'de';
    } else if (browserLocale.startsWith('zh')) {
        return 'zh';
    } else if (browserLocale.startsWith('ja')) {
        return 'ja';
    } else if (browserLocale.startsWith('ru')) {
        return 'ru';
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