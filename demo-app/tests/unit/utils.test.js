import { describe, expect, it } from 'vitest';
import { cn, formatDateLongItalyTimezone, getReadingMinutes } from '../../../src/lib/utils';

// Class merging: the `class` prop of every component goes through cn()
describe('cn', () => {
    // A later Tailwind class wins over a conflicting earlier one
    it('keeps the last of two conflicting classes', () => {
        expect(cn('px-2 text-sm', 'px-4')).toBe('text-sm px-4');
    });

    // Falsy values are skipped, so conditional classes can be passed inline
    it('ignores falsy values', () => {
        expect(cn('rounded', false && 'hidden', null, undefined, 'border')).toBe('rounded border');
    });
});

// Reading time shown in the blog post header
describe('getReadingMinutes', () => {
    // 220 words per minute, rounded
    it('estimates the minutes from the word count', () => {
        expect(getReadingMinutes('word '.repeat(660))).toBe(3);
    });

    // A very short post still reads as one minute, never zero
    it('never returns less than one minute', () => {
        expect(getReadingMinutes('')).toBe(1);
        expect(getReadingMinutes('just a few words')).toBe(1);
    });

    // Nuxt Content bodies are nested trees of nodes
    it('collects the text of nested content trees', () => {
        const body = { children: [{ value: 'word '.repeat(300) }, ['word '.repeat(140)]] };
        expect(getReadingMinutes(body)).toBe(2);
    });
});

// Long dates in the blog, always in the Italian timezone
describe('formatDateLongItalyTimezone', () => {
    // Missing or invalid dates render nothing instead of "Invalid Date"
    it('returns an empty string for missing or invalid dates', () => {
        expect(formatDateLongItalyTimezone(null, 'en')).toBe('');
        expect(formatDateLongItalyTimezone('not a date', 'en')).toBe('');
    });

    // Late evening in UTC is already the next day in Rome
    it('uses the Europe/Rome timezone', () => {
        expect(formatDateLongItalyTimezone('2026-06-14T23:30:00Z', 'en')).toBe('June 15, 2026');
    });

    // Timestamps stored as strings of digits are accepted
    it('accepts epoch milliseconds passed as a string', () => {
        expect(formatDateLongItalyTimezone(String(Date.UTC(2026, 0, 10, 12)), 'en')).toBe('January 10, 2026');
    });
});
