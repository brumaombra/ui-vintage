import { ref, type Ref } from 'vue';

// The visitor's choice: 'granted', 'denied' or null (not asked yet)
export type CookieConsentValue = 'granted' | 'denied' | null;

// One shared state per storage key, so the banner and the code loading the scripts stay in sync (browser only)
const consentStates = new Map<string, Ref<CookieConsentValue>>();

// Read the stored choice (storage can be unavailable, e.g. blocked in private windows)
const readStoredConsent = (storageKey: string): CookieConsentValue => {
    try {
        const value = localStorage.getItem(storageKey);
        return value === 'granted' || value === 'denied' ? value : null;
    } catch {
        return null;
    }
};

// Cookie consent state: gate optional scripts (analytics, ads) on `consent.value === 'granted'` and call `reset()` to ask again
export const useCookieConsent = (storageKey = 'cookieConsent') => {
    // On the server there is no stored choice (and no state must be shared between requests)
    if (typeof window === 'undefined') {
        const consent = ref<CookieConsentValue>(null);
        const noop = () => {};
        return { consent, accept: noop, decline: noop, reset: noop };
    }

    // Shared state for this key
    let consent = consentStates.get(storageKey);
    if (!consent) {
        consent = ref(readStoredConsent(storageKey));
        consentStates.set(storageKey, consent);
    }

    // Save a choice (null removes it, so the banner asks again)
    const state = consent;
    const setConsent = (value: CookieConsentValue) => {
        state.value = value;
        try {
            if (value) {
                localStorage.setItem(storageKey, value);
            } else {
                localStorage.removeItem(storageKey);
            }
        } catch { }
    };

    // Return the state and the actions
    return {
        consent: state,
        accept: () => setConsent('granted'),
        decline: () => setConsent('denied'),
        reset: () => setConsent(null)
    };
};