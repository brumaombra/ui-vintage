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