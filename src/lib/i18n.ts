import en from '@/i18n/en.json';
import it from '@/i18n/it.json';

// The list of translation files
export const uiVintageMessages = {
    en,
    it
} as const;

// Get the messages for a specific locale
export const getUiVintageMessagesForLocale = (locale: keyof typeof uiVintageMessages) => {
    return uiVintageMessages[locale];
};