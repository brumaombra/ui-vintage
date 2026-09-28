export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeTransitionOrigin {
    x: number;
    y: number;
}

const THEME_STORAGE_KEY = 'theme';

type DocumentWithViewTransition = Document & {
    startViewTransition?: (callback: () => void) => {
        ready: Promise<void>;
        finished: Promise<void>;
    };
};

// Check if the system prefers dark mode
const isSystemDarkPreferred = () => {
    return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
};

// Resolve whether a theme mode ends up dark
export const isDarkTheme = (theme: ThemeMode) => {
    return theme === 'dark' || (theme === 'auto' && isSystemDarkPreferred());
};

// Read the persisted theme mode
export const getStoredTheme = (): ThemeMode => {
    if (typeof localStorage === 'undefined') return 'auto';
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'auto';
};

// Apply the selected theme to the document and persist it
export const applyTheme = (theme: ThemeMode) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(isDarkTheme(theme) ? 'dark' : 'light');
    localStorage.setItem(THEME_STORAGE_KEY, theme);
};

// Apply a theme with a circular reveal that grows from the origin point (View Transitions API)
export const applyThemeWithTransition = async (theme: ThemeMode, origin?: ThemeTransitionOrigin | Element | null) => {
    const doc = document as DocumentWithViewTransition;
    const root = document.documentElement;
    const willChange = root.classList.contains('dark') !== isDarkTheme(theme);
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // Fall back to an instant switch when the transition is unsupported or pointless
    if (!doc.startViewTransition || !willChange || prefersReducedMotion) {
        applyTheme(theme);
        return;
    }

    // Resolve the reveal origin (defaults to the top-right corner)
    let x = window.innerWidth;
    let y = 0;
    if (origin instanceof Element) {
        const rect = origin.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
    } else if (origin) {
        x = origin.x;
        y = origin.y;
    }
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    // Freeze CSS transitions so the snapshots capture the final colors
    root.classList.add('uv-theme-switching');
    const transition = doc.startViewTransition(() => applyTheme(theme));

    try {
        await transition.ready;
        root.animate({
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]
        }, {
            duration: 620,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)'
        });
        await transition.finished;
    } finally {
        root.classList.remove('uv-theme-switching');
    }
};