import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { ToggleGroup, ToggleGroupItem } from '@brumaombra/ui-vintage/toggle-group';

// Mount a single-selection group with two items, the first one active
const mountGroup = props => mountSuspended(ToggleGroup, {
	props: { type: 'single', modelValue: 'buy', ...props },
	slots: { default: () => [h(ToggleGroupItem, { value: 'buy' }, () => 'Buy'), h(ToggleGroupItem, { value: 'sell' }, () => 'Sell')] }
});

// The highlighted group puts the active item on a solid orange indicator with dark text, like the active tab (orange text on its tint was only 2.1:1)
describe('ToggleGroup highlight', () => {
	// The active item of a highlighted group sits on the solid brand orange, with the text color made for it
	it('puts the active item of a highlighted group on solid orange', async () => {
		const wrapper = await mountGroup({ highlight: true });
		const items = wrapper.findAll('[data-slot="toggle-group-item"]');
		expect(items[0].classes()).toContain('data-[state=on]:text-primary-foreground');
		expect(items[0].classes()).not.toContain('data-[state=on]:text-primary');
		expect(wrapper.find('[data-slot="toggle-group-indicator"]').classes()).toEqual(expect.arrayContaining(['border-primary', 'bg-primary']));
	});

	// A plain group keeps the foreground text color
	it('keeps the foreground text without highlight', async () => {
		const wrapper = await mountGroup();
		const items = wrapper.findAll('[data-slot="toggle-group-item"]');
		expect(items[0].classes()).not.toContain('data-[state=on]:text-primary-foreground');
	});
});