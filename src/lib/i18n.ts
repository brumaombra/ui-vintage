import { useI18n } from 'vue-i18n';
import en from '../i18n/en.json';
import it from '../i18n/it.json';
import fr from '../i18n/fr.json';
import es from '../i18n/es.json';
import de from '../i18n/de.json';
import pt from '../i18n/pt.json';
import zh from '../i18n/zh.json';
import ja from '../i18n/ja.json';
import ru from '../i18n/ru.json';

// The list of translation files
export const uiVintageMessages = {
    en,
    it,
    fr,
    es,
    de,
    pt,
    zh,
    ja,
    ru
} as const;

// The type of the available locales based on the keys of the messages object
type UiVintageLocale = keyof typeof uiVintageMessages;

// Browser-only source of the app locale (set by the Nuxt plugin from the vue-i18n instance)
let runtimeLocaleSource: (() => string | undefined) | null = null;

// Let the app tell the imperatively mounted components which locale it uses
export const setUiVintageRuntimeLocaleSource = (source: (() => string | undefined) | null) => {
    runtimeLocaleSource = source;
};

// Resolve the current runtime locale from the app, the document or the navigator
const getUiVintageRuntimeLocale = (): UiVintageLocale => {
    let browserLocale = 'en';

    // Prefer the app locale, then try to detect the user's locale from the document or navigator
    const appLocale = runtimeLocaleSource?.();
    if (appLocale) {
        browserLocale = appLocale.toLowerCase();
    } else if (typeof document !== 'undefined' && document.documentElement?.lang) {
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
    } else if (browserLocale.startsWith('pt')) {
        return 'pt';
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

// Translate library messages inside components: use the app's vue-i18n when available (same locale on server and client),
// and fall back to the bundled messages in trees mounted outside the app (toasts, dialogs, busy indicator)
export const useUiVintageMessage = () => {
    let translate: ((key: string) => string) | null = null;
    try {
        translate = useI18n({ useScope: 'global' }).t;
    } catch {
        translate = null;
    }

    return (path: string, fallback: string) => {
        const message = translate?.(path);
        return message && message !== path ? message : getUiVintageRuntimeMessage(path, fallback);
    };
};
