import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { CardGrid } from '@brumaombra/ui-vintage/card-grid';

// A few items, each rendered as a plain card
const items = [{ id: 1, name: 'One' }, { id: 2, name: 'Two' }];

// Mount the grid with a card slot that shows the item name
const mountGrid = props => mountSuspended(CardGrid, {
	props: { items, emptyMessage: 'Nothing here', ...props },
	slots: { card: ({ item }) => item.name }
});

// Card grid: the space between the cards, and the loading state
describe('CardGrid', () => {
	// Without a gap, the cards keep the default spacing (8px on phones, less than the page padding)
	it('uses the default gap', async () => {
		const wrapper = await mountGrid();
		const grid = wrapper.find('.grid');
		expect(grid.text()).toContain('One');
		expect(grid.classes()).toEqual(expect.arrayContaining(['gap-2', 'sm:gap-4', 'md:gap-6', 'xl:gap-4']));
	});

	// Each preset sets its own spacing
	it('sets a smaller or larger gap', async () => {
		const small = await mountGrid({ gap: 'sm' });
		expect(small.find('.grid').classes()).toEqual(expect.arrayContaining(['gap-2', 'md:gap-3']));
		expect(small.find('.grid').classes()).not.toContain('md:gap-6');

		const large = await mountGrid({ gap: 'lg' });
		expect(large.find('.grid').classes()).toEqual(expect.arrayContaining(['gap-2.5', 'sm:gap-5', 'md:gap-8', 'xl:gap-6']));
	});

	// While busy, a skeleton slot fills the grid with placeholder cards in the same layout
	it('shows placeholder cards while busy', async () => {
		const wrapper = await mountSuspended(CardGrid, {
			props: { items: [], busy: true, emptyMessage: 'Nothing here', skeletonCount: 3 },
			slots: { card: ({ item }) => item.name, skeleton: () => 'Placeholder' }
		});
		const grid = wrapper.find('[role="status"]');
		expect(grid.classes()).toEqual(expect.arrayContaining(['grid', 'gap-2']));
		expect(grid.text().match(/Placeholder/g)).toHaveLength(3);
		expect(wrapper.find('.animate-spin').exists()).toBe(false); // No loading card
	});

	// Without a skeleton slot, busy keeps the loading card
	it('keeps the loading card without a skeleton', async () => {
		const wrapper = await mountGrid({ busy: true });
		expect(wrapper.find('[role="status"]').exists()).toBe(false);
		expect(wrapper.find('.animate-spin').exists()).toBe(true);
		expect(wrapper.text()).not.toContain('One');
	});
});