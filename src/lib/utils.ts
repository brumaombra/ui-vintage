import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function to merge class names using clsx and tailwind-merge
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
};

// Format a date in long format for Italy timezone
export function formatDateLongItalyTimezone(date: string | number | Date | null | undefined, locale: string) {
    if (!date) return '';

    // Parse the date input into a Date object
    const parsedDate = typeof date === 'string' && /^\d+$/.test(date)
        ? new Date(Number(date))
        : new Date(date);

    // Check if the parsed date is valid
    if (isNaN(parsedDate.getTime())) return '';

    // Return the formatted date
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Europe/Rome'
    }).format(parsedDate);
};
// Estimate the reading time in minutes from any text or content tree (about 220 words per minute)
export function getReadingMinutes(content: unknown, wordsPerMinute = 220) {
    // Follow only the branches that hold readable text: tag names, props and the table of contents are skipped
    const collectText = (node: unknown): string => {
        if (typeof node === 'string') return node;
        if (Array.isArray(node)) {
            // Minimark elements are [tag, props, ...children]
            const isElement = typeof node[0] === 'string' && !!node[1] && typeof node[1] === 'object' && !Array.isArray(node[1]);
            return (isElement ? node.slice(2) : node).map(collectText).join(' ');
        }
        if (node && typeof node === 'object') {
            // Documents keep the text in body, minimark bodies in value, AST nodes in children (or value for text nodes)
            const record = node as Record<string, unknown>;
            return ['body', 'value', 'children'].map(key => collectText(record[key])).join(' ');
        }
        return '';
    };
    const words = collectText(content).split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / wordsPerMinute));
};
