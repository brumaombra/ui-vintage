import { readonly, ref } from 'vue';
import { applyTheme, applyThemeWithTransition, getStoredTheme, type ThemeMode, type ThemeTransitionOrigin } from './theme-transition';

// Current theme, shared by every theme control of the page (each control used to keep its own copy, so two of them went out of sync); it is only written in the browser
const currentTheme = ref<ThemeMode>('auto');
let started = false;

// Read the saved theme once, and follow the system preference while the theme is auto
const startTheme = () => {
	if (started || typeof window === 'undefined') return;
	started = true;
	currentTheme.value = getStoredTheme();
	applyTheme(currentTheme.value);
	window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', () => {
		if (currentTheme.value === 'auto') void applyThemeWithTransition('auto');
	});
};

// Change the theme for the whole page, with the circular reveal from the origin (a point or an element)
const setTheme = async (theme: ThemeMode, origin?: ThemeTransitionOrigin | Element | null) => {
	currentTheme.value = theme;
	await applyThemeWithTransition(theme, origin);
};

// Theme of the page and the way to change it (call it in setup; the saved theme is read in the browser, so until mounted it reads auto, like on the server)
export const useTheme = () => ({
	theme: readonly(currentTheme),
	startTheme,
	setTheme
});