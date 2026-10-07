import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { Accordion } from '@brumaombra/ui-vintage/accordion';
import { DashboardShell } from '@brumaombra/ui-vintage/dashboard-shell';
import { LandingNavbar } from '@brumaombra/ui-vintage/landing-navbar';
import { Avatar, AvatarFallback } from '@brumaombra/ui-vintage/avatar';
import { Button } from '@brumaombra/ui-vintage/button';
import { DataTable } from '@brumaombra/ui-vintage/data-table';
import { LoadMoreButton } from '@brumaombra/ui-vintage/load-more-button';
import { ProgressComponent } from '@brumaombra/ui-vintage/progress-component';
import { Command, CommandGroup, CommandItem, CommandList } from '@brumaombra/ui-vintage/command';
import { Field, FieldLabel } from '@brumaombra/ui-vintage/field';
import { Input } from '@brumaombra/ui-vintage/input';
import { NumberField } from '@brumaombra/ui-vintage/number-field';
import { Select, SelectTrigger, SelectValue } from '@brumaombra/ui-vintage/select';
import { DateTimePicker } from '@brumaombra/ui-vintage/date-time-picker';
import { h } from 'vue';
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

    // Screen readers hear which navigation link is the current page
    it('marks the active link as the current page', async () => {
        const sidebarSections = [{ id: 'main', label: 'Main', items: [{ id: 'home', label: 'Home', href: '/home', active: true }, { id: 'settings', label: 'Settings', href: '/settings' }] }];
        const wrapper = await mountSuspended(DashboardShell, { props: { appName: 'Acme', sidebarSections } });
        expect(wrapper.find('a[href="/home"]').attributes('aria-current')).toBe('page');
        expect(wrapper.find('a[href="/settings"]').attributes('aria-current')).toBeUndefined();
    });
});

describe('LandingNavbar', () => {
    // A logo without an app name is named "Home", like in the dashboard shell
    it('gives a logo-only brand a fallback alt text', async () => {
        const wrapper = await mountSuspended(LandingNavbar, { props: { appLogo: '/logo.svg' } });
        expect(wrapper.find('img').attributes('alt')).toBe('Home');
    });

    // Without a logo or a name there is no empty home link
    it('renders no brand link without a logo or a name', async () => {
        const wrapper = await mountSuspended(LandingNavbar, { props: { appLinkTo: '/' } });
        expect(wrapper.find('a[href="/"]').exists()).toBe(false);
    });
});

describe('Button', () => {
    // The disabled prop never hides the loading state
    it('stays disabled while loading even when disabled is false', async () => {
        const wrapper = await mountSuspended(Button, { props: { loading: true, disabled: false }, slots: { default: () => 'Save' } });
        expect(wrapper.find('button').attributes('disabled')).toBeDefined();
        expect(wrapper.find('button').attributes('aria-busy')).toBe('true');
    });
});

describe('LoadMoreButton', () => {
    // One button for both states, so keyboard focus survives the loading phase
    it('keeps the same button while loading and ignores clicks', async () => {
        const wrapper = await mountSuspended(LoadMoreButton, { props: { busy: false } });
        const button = wrapper.find('button').element;
        await wrapper.setProps({ busy: true });
        expect(wrapper.find('button').element).toBe(button);
        expect(wrapper.find('button').attributes('aria-disabled')).toBe('true');
        await wrapper.find('button').trigger('click');
        expect(wrapper.emitted('load-more')).toBeUndefined();
    });
});

describe('DataTable', () => {
    // Clickable rows are reachable with Tab and open with Enter or Space
    it('activates clickable rows from the keyboard', async () => {
        const wrapper = await mountSuspended(DataTable, { props: { columns: [{ key: 'name', label: 'Name' }], rows: [{ id: 1, name: 'Ada' }], rowClickable: true } });
        const row = wrapper.findAll('tr').find(item => item.text().includes('Ada'));
        expect(row.attributes('tabindex')).toBe('0');
        await row.trigger('keydown', { key: 'Enter' });
        await row.trigger('keydown', { key: ' ' });
        await row.trigger('keydown', { key: 'a' });
        expect(wrapper.emitted('row-click')).toHaveLength(2);
    });
});

describe('ProgressComponent', () => {
    // The progress bar is named after its visible title
    it('names the progress bar after the title', async () => {
        const wrapper = await mountSuspended(ProgressComponent, { props: { title: 'Storage', value: 3, max: 10 } });
        const bar = wrapper.find('[role="progressbar"]');
        expect(wrapper.find(`#${bar.attributes('aria-labelledby')}`).text()).toBe('Storage');
    });
});

describe('AvatarFallback', () => {
    // Screen readers hear the name, not the initials
    it('announces the name instead of the initials', async () => {
        const wrapper = await mountSuspended({ render: () => h(Avatar, null, () => h(AvatarFallback, { name: 'Jane Doe' })) });
        const fallback = wrapper.find('[data-slot="avatar-fallback"]');
        expect(fallback.attributes('role')).toBe('img');
        expect(fallback.attributes('aria-label')).toBe('Jane Doe');
    });
});

describe('Field', () => {
    // The label points to the control placed in the same field, without ids written by hand
    it('links the label to an input, a number field and a select trigger', async () => {
        const wrapper = await mountSuspended({
            render: () => [
                h(Field, null, () => [h(FieldLabel, null, () => 'Name'), h(Input)]),
                h(Field, null, () => [h(FieldLabel, null, () => 'Seats'), h(NumberField, { defaultValue: 1 })]),
                h(Field, null, () => [h(FieldLabel, null, () => 'Region'), h(Select, null, () => h(SelectTrigger, null, () => h(SelectValue, { placeholder: 'Pick one' })))])
            ]
        });
        const labels = wrapper.findAll('label');
        expect(labels).toHaveLength(3);
        for (const label of labels) {
            const target = wrapper.find(`#${label.attributes('for')}`);
            expect(target.exists()).toBe(true);
            expect(['INPUT', 'BUTTON']).toContain(target.element.tagName);
        }
    });

    // An id written on the control still wins
    it('keeps an explicit control id', async () => {
        const wrapper = await mountSuspended({ render: () => h(Field, null, () => [h(FieldLabel, null, () => 'Email'), h(Input, { id: 'email' })]) });
        expect(wrapper.find('label').attributes('for')).toBe('email');
        expect(wrapper.find('input').attributes('id')).toBe('email');
    });

    // The date button is named by the label plus its value, and the time input has its own name
    it('names both parts of a date and time picker', async () => {
        const wrapper = await mountSuspended({ render: () => h(Field, null, () => [h(FieldLabel, null, () => 'Meeting'), h(DateTimePicker)]) });
        const label = wrapper.find('label');
        const button = wrapper.find(`#${label.attributes('for')}`);
        expect(button.element.tagName).toBe('BUTTON');
        expect(button.attributes('aria-labelledby')).toBe(`${label.attributes('id')} ${button.attributes('id')}`);
        expect(wrapper.find('input[type="time"]').attributes('aria-label')).toBe('Time');
    });
});

describe('CommandList', () => {
    // The list of results has a name for screen readers
    it('names the result list', async () => {
        const wrapper = await mountSuspended({ render: () => h(Command, null, () => h(CommandList, null, () => h(CommandGroup, null, () => h(CommandItem, { value: 'a' }, () => 'Open')))) });
        expect(wrapper.find('[role="listbox"]').attributes('aria-label')).toBe('Command palette');
    });
});
