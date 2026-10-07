import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// Library source folder, found from this file so the tests run from any folder
const librarySource = fileURLToPath(new URL('../../../src', import.meta.url));

// Flatten a locale into { "a.b.c": "text" }
const flatten = (object, prefix = '') => Object.entries(object).flatMap(([key, value]) => {
    return value && typeof value === 'object' ? flatten(value, `${prefix}${key}.`) : [[`${prefix}${key}`, value]];
});

// Distinct placeholders used in a translation, e.g. "{count}" (plural forms repeat them, and some languages have fewer forms)
const readPlaceholders = text => [...new Set([...String(text).matchAll(/\{(\w+)\}/g)].map(match => match[1]))].sort();

// All the library source files that can call t()
const readSourceFiles = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return readSourceFiles(path);
    return /\.(vue|ts)$/.test(entry.name) ? [path] : [];
});

// Read a library locale file
const readLocale = code => Object.fromEntries(flatten(JSON.parse(readFileSync(join(librarySource, 'i18n', `${code}.json`), 'utf8'))));

const english = readLocale('en');
const otherCodes = ['it', 'fr', 'es', 'de', 'pt', 'zh', 'ja', 'ru'];

// Library translations: a missing key shows the raw key (e.g. "uiVintage.blog.readMore") to the user
describe('library locales', () => {
    // Every locale has exactly the English keys
    for (const code of otherCodes) {
        it(`${code} has the same keys as en`, () => {
            expect(Object.keys(readLocale(code)).sort()).toEqual(Object.keys(english).sort());
        });

        // A translated text keeps the placeholders of the English one
        it(`${code} keeps the English placeholders`, () => {
            const locale = readLocale(code);
            for (const [key, text] of Object.entries(english)) {
                expect(readPlaceholders(locale[key]), key).toEqual(readPlaceholders(text));
            }
        });
    }

    // No translation is left empty
    it('has no empty texts', () => {
        for (const code of ['en', ...otherCodes]) {
            for (const [key, text] of Object.entries(readLocale(code))) {
                expect(String(text).trim(), `${code}: ${key}`).not.toBe('');
            }
        }
    });

    // Every key the components ask for exists
    it('defines every key used in the library source', () => {
        const used = new Set(readSourceFiles(join(librarySource, 'components')).flatMap(file => {
            return [...readFileSync(file, 'utf8').matchAll(/['"`](uiVintage\.[\w.]+)['"`]/g)].map(match => match[1]);
        }));
        const missing = [...used].filter(key => !(key in english));
        expect(missing).toEqual([]);
    });
});
