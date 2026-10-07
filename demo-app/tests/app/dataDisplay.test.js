import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { Money03Icon, UserGroupIcon } from '@hugeicons/core-free-icons';
import { Progress } from '@brumaombra/ui-vintage/progress';
import { SingleValueCard } from '@brumaombra/ui-vintage/single-value-card';
import { StatStrip } from '@brumaombra/ui-vintage/stat-strip';

// Euro amounts without decimals, as used across the demo
const euro = { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 };

// Numbers are formatted with the runtime locale, so build the expected text the same way (with plain spaces, like the text read from the page)
const formatNumber = (value, options) => new Intl.NumberFormat(undefined, options).format(value).replace(/\s+/g, ' ');

// Stat cards and strips: the numbers people read first
describe('StatStrip', () => {
    // Each item shows its value and label, numbers formatted with their options
    it('renders every item with its formatted value', async () => {
        const wrapper = await mountSuspended(StatStrip, {
            props: {
                animate: false,
                items: [
                    { icon: UserGroupIcon, value: 1284, label: 'customers' },
                    { icon: Money03Icon, value: 48290, label: 'revenue', formatOptions: euro },
                    { value: '+12%', label: 'growth' }
                ]
            }
        });
        const items = wrapper.findAll('li').map(item => item.text().replace(/\s+/g, ' '));
        expect(items).toHaveLength(3);
        expect(items[0]).toContain(formatNumber(1284));
        expect(items[0]).toContain('customers');
        expect(items[1]).toContain(formatNumber(48290, euro));
        expect(items[1]).toContain('revenue');
        expect(items[2]).toContain('+12%');
        expect(items[2]).toContain('growth');
    });

    // Nothing is rendered without items
    it('renders nothing when there are no items', async () => {
        const wrapper = await mountSuspended(StatStrip, { props: { items: [] } });
        expect(wrapper.find('ul').exists()).toBe(false);
    });
});

describe('SingleValueCard', () => {
    // Without format options a static number is shown exactly as given (IDs, years)
    it('keeps plain numbers unformatted when not animated', async () => {
        const wrapper = await mountSuspended(SingleValueCard, { props: { label: 'Order ID', value: 1234567, icon: Money03Icon, animate: false } });
        expect(wrapper.text()).toContain('1234567');
        expect(wrapper.text()).not.toContain(formatNumber(1234567));
    });

    // Format options still apply when the count-up is turned off
    it('formats static numbers with formatOptions', async () => {
        const wrapper = await mountSuspended(SingleValueCard, { props: { label: 'Revenue', value: 48290, icon: Money03Icon, animate: false, formatOptions: euro } });
        expect(wrapper.text().replace(/\s+/g, ' ')).toContain(formatNumber(48290, euro));
    });

    // The trend badge shows the sign and the label
    it('shows the trend and its label', async () => {
        const wrapper = await mountSuspended(SingleValueCard, { props: { label: 'Churn', value: '1.2%', icon: Money03Icon, trend: -0.3, trendLabel: 'vs last month' } });
        expect(wrapper.text()).toContain('-0.3%');
        expect(wrapper.text()).toContain('vs last month');
    });
});

// Progress: screen readers must not hear "0%" for an indeterminate bar
describe('Progress', () => {
    it('reports no value while indeterminate', async () => {
        const wrapper = await mountSuspended(Progress, { props: { indeterminate: true } });
        const root = wrapper.find('[data-slot="progress"]');
        expect(root.attributes('aria-valuenow')).toBeUndefined();
        expect(root.attributes('data-state')).toBe('indeterminate');
    });

    it('reports the value when determinate', async () => {
        const wrapper = await mountSuspended(Progress, { props: { modelValue: 35 } });
        expect(wrapper.find('[data-slot="progress"]').attributes('aria-valuenow')).toBe('35');
    });
});
