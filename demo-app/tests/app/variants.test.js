import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import SearchIcon from '@hugeicons/core-free-icons/Search01Icon';
import { ActionBar } from '@brumaombra/ui-vintage/action-bar';
import { Avatar, AvatarFallback } from '@brumaombra/ui-vintage/avatar';
import { Badge } from '@brumaombra/ui-vintage/badge';
import { Button } from '@brumaombra/ui-vintage/button';
import { Card, CardMedia, CardTitle } from '@brumaombra/ui-vintage/card';
import { Command, CommandGroup, CommandItem, CommandList } from '@brumaombra/ui-vintage/command';
import { DataListText } from '@brumaombra/ui-vintage/data-list';
import { dialogSizeClasses } from '@brumaombra/ui-vintage/dialog';
import { Input } from '@brumaombra/ui-vintage/input';
import { Progress } from '@brumaombra/ui-vintage/progress';
import { SelectItemContent } from '@brumaombra/ui-vintage/select';
import { SectionTitle } from '@brumaombra/ui-vintage/section-title';
import { Skeleton } from '@brumaombra/ui-vintage/skeleton';
import { TableRow } from '@brumaombra/ui-vintage/table';

// Props and variants that let apps style components without overriding their classes
describe('Card', () => {
	// The default card pads its header and content sections
	it('pads its sections by default', async () => {
		const wrapper = await mountSuspended(Card, { slots: { default: () => 'Content' } });
		expect(wrapper.classes()).toContain('py-6');
	});

	// A padding-less card clips its own edge-to-edge sections
	it('drops the padding and clips with padding none', async () => {
		const wrapper = await mountSuspended(Card, { props: { padding: 'none' }, slots: { default: () => 'Content' } });
		expect(wrapper.classes()).not.toContain('py-6');
		expect(wrapper.classes()).toContain('overflow-hidden');
	});

	// The elevation replaces the default shadow
	it('applies the elevation shadow', async () => {
		const wrapper = await mountSuspended(Card, { props: { elevation: 'xl' }, slots: { default: () => 'Content' } });
		expect(wrapper.classes()).toContain('shadow-elevated-xl');
		expect(wrapper.classes()).not.toContain('shadow-elevated-sm');
	});

	// Media is marked so the card can bleed it to the top edge
	it('marks the media slot', async () => {
		const wrapper = await mountSuspended(CardMedia, { slots: { default: () => h('img', { alt: '' }) } });
		expect(wrapper.attributes('data-slot')).toBe('card-media');
	});

	// The title can lead with an icon
	it('renders the title icon', async () => {
		const wrapper = await mountSuspended(CardTitle, { props: { icon: SearchIcon }, slots: { default: () => 'Title' } });
		expect(wrapper.find('svg').exists()).toBe(true);
		expect(wrapper.text()).toBe('Title');
	});
});

describe('TableRow', () => {
	// Static rows don't highlight on hover
	it('drops the hover with static', async () => {
		const plain = await mountSuspended(TableRow, { slots: { default: () => '' } });
		const fixed = await mountSuspended(TableRow, { props: { static: true }, slots: { default: () => '' } });
		expect(plain.classes()).toContain('hover:bg-muted/50');
		expect(fixed.classes()).not.toContain('hover:bg-muted/50');
	});

	// Selected rows get the soft primary tint
	it('tints selected rows with the primary color', async () => {
		const wrapper = await mountSuspended(TableRow, { slots: { default: () => '' } });
		expect(wrapper.classes()).toContain('data-[state=selected]:bg-primary/5');
	});

	// Interactive rows show a pointer
	it('shows a pointer when interactive', async () => {
		const wrapper = await mountSuspended(TableRow, { props: { interactive: true }, slots: { default: () => '' } });
		expect(wrapper.classes()).toContain('cursor-pointer');
	});
});

describe('Text, inputs and badges', () => {
	// Long text is clamped unless it should wrap in full
	it('wraps the full text with wrap', async () => {
		const clamped = await mountSuspended(DataListText, { slots: { default: () => 'Text' } });
		const full = await mountSuspended(DataListText, { props: { wrap: true }, slots: { default: () => 'Text' } });
		expect(clamped.classes()).toContain('line-clamp-3');
		expect(full.classes()).toContain('whitespace-pre-wrap');
	});

	// The suffix sits inside the field, and the attributes still reach the input
	it('renders a suffix and keeps the input attributes', async () => {
		const wrapper = await mountSuspended(Input, { attrs: { type: 'number', min: '1' }, slots: { suffix: () => 'Shares' } });
		expect(wrapper.find('[data-slot="input-suffix"]').text()).toBe('Shares');
		expect(wrapper.find('input').attributes('type')).toBe('number');
		expect(wrapper.find('input').attributes('min')).toBe('1');
	});

	// A prefix (like a search icon) sits inside the field too
	it('renders a prefix', async () => {
		const wrapper = await mountSuspended(Input, { slots: { prefix: () => h('svg') } });
		expect(wrapper.find('[data-slot="input-prefix"] svg').exists()).toBe(true);
	});

	// The small input matches the small select trigger
	it('renders the small size', async () => {
		const wrapper = await mountSuspended(Input, { props: { size: 'sm' } });
		expect(wrapper.find('input').classes()).toContain('h-10');
	});

	// Circle skeletons stand in for avatars
	it('renders a circle skeleton', async () => {
		const wrapper = await mountSuspended(Skeleton, { props: { circle: true } });
		expect(wrapper.classes()).toContain('rounded-full');
	});

	// The primary badge is neutral with dark text, its dot carrying the brand orange (orange text on its tint was only 2.1:1)
	it('keeps the brand orange in the dot of the primary badge', async () => {
		const wrapper = await mountSuspended(Badge, { props: { text: 'Sports', color: 'primary', dot: true } });
		expect(wrapper.classes()).toContain('text-foreground');
		expect(wrapper.classes()).not.toContain('text-primary');
		expect(wrapper.find('.size-1\\.5.rounded-full').classes()).toContain('bg-primary');
	});

	// A badge used as a link lifts and tints on hover (the blog tags used to fade instead)
	it('lifts and tints an interactive badge', async () => {
		const wrapper = await mountSuspended(Badge, { props: { text: '#Vue', interactive: true } });
		expect(wrapper.classes()).toEqual(expect.arrayContaining(['hover:-translate-y-0.5', 'hover:bg-[color-mix(in_oklab,var(--primary)_10%,var(--surface))]']));

		// The text keeps its color on hover (orange text on the hover tint was below 4.5:1)
		expect(wrapper.classes()).not.toContain('hover:text-primary');

		// The hover tint is solid: a translucent one let the page grid show through the tag
		expect(wrapper.classes().filter(name => /^hover:bg-primary\//.test(name))).toEqual([]);
		const still = await mountSuspended(Badge, { props: { text: '#Vue' } });
		expect(still.classes()).not.toContain('hover:-translate-y-0.5');
	});

	// Auto-colored initials always get the same tint for the same name
	it('picks a stable tint from the name', async () => {
		const mountAvatar = () => mountSuspended(Avatar, { slots: { default: () => h(AvatarFallback, { name: 'Giulia', color: 'auto' }) } });
		const first = (await mountAvatar()).find('[data-slot="avatar-fallback"]');
		const second = (await mountAvatar()).find('[data-slot="avatar-fallback"]');
		expect(first.classes().join(' ')).toContain('var(--chart-');
		expect(first.classes()).toEqual(second.classes());
	});
});

describe('SelectItemContent', () => {
	// The default slot takes the place of the icon (flags passed to it used to be dropped)
	it('renders a leading visual from the default slot', async () => {
		const wrapper = await mountSuspended(SelectItemContent, { props: { label: 'Italiano' }, slots: { default: () => h('span', { 'data-test': 'flag' }) } });
		expect(wrapper.find('[data-slot="select-item-content-icon"] [data-test="flag"]').exists()).toBe(true);
		expect(wrapper.text()).toContain('Italiano');
	});

	// Without a slot or an icon there is no empty leading box
	it('leaves out the leading box without a slot or an icon', async () => {
		const wrapper = await mountSuspended(SelectItemContent, { props: { label: 'English' } });
		expect(wrapper.find('[data-slot="select-item-content-icon"]').exists()).toBe(false);
	});
});

describe('SectionTitle', () => {
	// The heading level and the icon tile are configurable
	it('renders the title, description and icon', async () => {
		const wrapper = await mountSuspended(SectionTitle, { props: { title: 'Market FAQ', description: 'How it works', icon: SearchIcon, headingLevel: 3 } });
		expect(wrapper.find('h3').text()).toBe('Market FAQ');
		expect(wrapper.text()).toContain('How it works');
		expect(wrapper.find('svg').exists()).toBe(true);
		expect(wrapper.classes()).toContain('flex-col');
	});

	// The icon tile is solid, so the page grid does not show through it
	it('draws the icon on a solid tile', async () => {
		const wrapper = await mountSuspended(SectionTitle, { props: { title: 'Sports', icon: SearchIcon } });
		const tile = wrapper.find('svg').element.parentElement;
		expect(tile.className).toContain('bg-[color-mix(in_oklab,var(--primary)_10%,var(--card))]');
	});

	// Without a description the action stays on the title row, even on mobile
	it('keeps the action next to a title without description', async () => {
		const wrapper = await mountSuspended(SectionTitle, { props: { title: 'Trending' }, slots: { action: () => 'View all' } });
		expect(wrapper.classes()).not.toContain('flex-col');
		expect(wrapper.classes()).toContain('items-center');
		expect(wrapper.text()).toContain('View all');
	});
});

describe('CommandItem', () => {
	// The theme and language selectors: the selected item used to look hovered all the time (background and bar), now only its tick marks it
	it('marks the selection only with the tick, and hovers like the menu items', async () => {
		const wrapper = await mountSuspended({
			render: () => h(Command, { modelValue: 'dark' }, () => h(CommandList, null, () => h(CommandGroup, null, () => [
				h(CommandItem, { value: 'light' }, () => [h(SearchIcon), 'Light']),
				h(CommandItem, { value: 'dark' }, () => [h(SearchIcon), 'Dark'])
			])))
		});
		const selected = wrapper.findAll('[data-slot="command-item"]')[1];
		expect(selected.attributes('data-state')).toBe('checked');
		expect(selected.classes().filter(name => name.includes('data-[state=checked]'))).toEqual([]);

		// Expect the hover bar and the nudge of the leading icon, as in the dropdown menu (and the same look for keyboard focus)
		expect(selected.classes()).toEqual(expect.arrayContaining(['hover:bg-accent', 'hover:before:scale-y-100', '[&:is(:hover,:focus-visible)>svg:first-child]:translate-x-0.5']));

		// Expect the open listbox's own highlight (it focuses the selected item) not to paint the hover look by itself
		expect(selected.classes().filter(name => name.startsWith('data-highlighted:'))).toEqual([]);
	});
});

describe('Actions and feedback', () => {
	// Link buttons have no box padding
	it('removes the padding of link buttons', async () => {
		const wrapper = await mountSuspended(Button, { props: { variant: 'link' }, slots: { default: () => 'More' } });
		expect(wrapper.classes()).toContain('px-0');
	});

	// The action bar lays out its buttons
	it('renders the action bar', async () => {
		const wrapper = await mountSuspended(ActionBar, { slots: { default: () => h(Button, () => 'Edit') } });
		expect(wrapper.attributes('data-slot')).toBe('action-bar');
		expect(wrapper.find('[data-slot="button"]').exists()).toBe(true);
	});

	// The progress fill follows the color
	it('colors the progress bar', async () => {
		const wrapper = await mountSuspended(Progress, { props: { modelValue: 40, color: 'red' } });
		expect(wrapper.find('[data-slot="progress-indicator"]').classes()).toContain('bg-destructive');
	});

	// Every dialog size has a width
	it('defines a width for every dialog size', () => {
		expect(Object.keys(dialogSizeClasses)).toEqual(['sm', 'md', 'lg', 'xl']);
	});
});