import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { ToggleGroup, ToggleGroupItem } from '@brumaombra/ui-vintage/toggle-group';

// Mount a single-selection group with two items, the first one active
const mountGroup = props => mountSuspended(ToggleGroup, {
	props: { type: 'single', modelValue: 'buy', ...props },
	slots: { default: () => [h(ToggleGroupItem, { value: 'buy' }, () => 'Buy'), h(ToggleGroupItem, { value: 'sell' }, () => 'Sell')] }
});

// The highlighted group tints the active item text with the primary color, like the active tab
describe('ToggleGroup highlight', () => {
	// The active item of a highlighted group uses the primary text color
	it('tints the active item of a highlighted group', async () => {
		const wrapper = await mountGroup({ highlight: true });
		const items = wrapper.findAll('[data-slot="toggle-group-item"]');
		expect(items[0].classes()).toContain('data-[state=on]:text-primary');
	});

	// A plain group keeps the foreground text color
	it('keeps the foreground text without highlight', async () => {
		const wrapper = await mountGroup();
		const items = wrapper.findAll('[data-slot="toggle-group-item"]');
		expect(items[0].classes()).not.toContain('data-[state=on]:text-primary');
	});
});