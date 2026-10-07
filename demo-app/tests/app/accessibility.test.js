import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { Accordion } from '@brumaombra/ui-vintage/accordion';
import { DashboardShell } from '@brumaombra/ui-vintage/dashboard-shell';
import { SwitchFormComponent } from '@brumaombra/ui-vintage/switch-form-component';

// Accessible names: what screen readers announce for each control
describe('Accordion', () => {
    // The panel is a region named by its trigger
    it('names its panel after the trigger', async () => {
        const wrapper = await mountSuspended(Accordion, { props: { title: 'What is UI Vintage?' }, slots: { default: () => 'A Nuxt library.' } });
        const trigger = wrapper.find('button');
        const region = wrapper.find('[role="region"]');
        expect(region.attributes('aria-labelledby')).toBe(trigger.attributes('id'));
        expect(trigger.attributes('aria-controls')).toBe(region.attributes('id'));
    });
});

describe('SwitchFormComponent', () => {
    // The visible label names the switch, and the description describes it
    it('links the label and the description to the switch', async () => {
        const wrapper = await mountSuspended(SwitchFormComponent, { props: { id: 'previews', label: 'Preview branches', description: 'One URL per pull request.', modelValue: false } });
        expect(wrapper.find('label').attributes('for')).toBe('previews');
        expect(wrapper.find('#previews').attributes('aria-describedby')).toBe('previews-description');
        expect(wrapper.find('#previews-description').text()).toBe('One URL per pull request.');
    });
});

describe('DashboardShell', () => {
    // A logo without an app name still renders, named "Home" for the link around it
    it('renders a logo-only header with a fallback alt text', async () => {
        const wrapper = await mountSuspended(DashboardShell, { props: { appLogo: '/logo.svg' } });
        const logo = wrapper.find('img');
        expect(logo.exists()).toBe(true);
        expect(logo.attributes('alt')).toBe('Home');
    });

    // With both logos, each one is shown only in its theme
    it('switches between the light and dark logo with the theme', async () => {
        const wrapper = await mountSuspended(DashboardShell, { props: { appName: 'Acme', appLogo: '/logo.svg', appLogoDark: '/logo-dark.svg' } });
        const [light, dark] = wrapper.findAll('img');
        expect(light.classes()).toContain('dark:hidden');
        expect(dark.classes()).toEqual(expect.arrayContaining(['hidden', 'dark:block']));
        expect(light.attributes('alt')).toBe('Acme logo');
    });
});
