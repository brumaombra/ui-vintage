import { afterEach, describe, expect, it, vi } from 'vitest';
import { applyTheme, getStoredTheme } from '../../../src/components/theme-selector/theme-transition';

// Minimal document whose root element tracks its classes
const stubDocument = () => {
    const classes = new Set();
    vi.stubGlobal('document', {
        documentElement: {
            classList: {
                add: (...names) => names.forEach(name => classes.add(name)),
                remove: (...names) => names.forEach(name => classes.delete(name)),
                contains: name => classes.has(name)
            }
        }
    });
    vi.stubGlobal('window', { matchMedia: () => ({ matches: false }) });
    return classes;
};

// Storage that throws, like browsers with blocked site data
const blockedStorage = {
    getItem: () => { throw new Error('SecurityError'); },
    setItem: () => { throw new Error('SecurityError'); }
};

// Theme persistence used by ThemeSelector
describe('theme storage', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    // Only light and dark are stored; anything else means automatic
    it('reads the stored theme and falls back to auto', () => {
        vi.stubGlobal('localStorage', { getItem: () => 'dark' });
        expect(getStoredTheme()).toBe('dark');
        vi.stubGlobal('localStorage', { getItem: () => 'purple' });
        expect(getStoredTheme()).toBe('auto');
    });

    // Blocked storage must not break the theme selector
    it('falls back to auto when storage is blocked', () => {
        vi.stubGlobal('localStorage', blockedStorage);
        expect(getStoredTheme()).toBe('auto');
    });

    // The theme still applies when it cannot be saved
    it('applies the theme even when storage is blocked', () => {
        const classes = stubDocument();
        vi.stubGlobal('localStorage', blockedStorage);
        expect(() => applyTheme('dark')).not.toThrow();
        expect(classes.has('dark')).toBe(true);
        applyTheme('light');
        expect([...classes]).toEqual(['light']);
    });
});
