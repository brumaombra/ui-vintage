import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { ThemeSelector, useTheme } from '@brumaombra/ui-vintage/theme-selector';

// Theme of the page: every control shares it, so a change from one shows in the others
describe('useTheme', () => {
	// Two selectors used to keep their own copy of the theme, and the other one went on showing the old theme
	it('shares the theme between the controls of the page', async () => {
		const first = await mountSuspended(ThemeSelector);
		const second = await mountSuspended(ThemeSelector);
		const { theme, setTheme } = useTheme();

		// Change it from code, as a settings row of the app does
		await setTheme('dark');
		expect(theme.value).toBe('dark');
		expect(useTheme().theme.value).toBe('dark');
		expect(document.documentElement.classList.contains('dark')).toBe(true);
		expect(localStorage.getItem('theme')).toBe('dark');

		// Expect both selectors to show it (the icon of the trigger follows the theme)
		await first.vm.$nextTick();
		expect(first.html()).toBe(second.html());

		// Back to light
		await setTheme('light');
		expect(document.documentElement.classList.contains('light')).toBe(true);
	});
});