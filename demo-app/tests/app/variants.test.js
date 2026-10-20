import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import SearchIcon from '@hugeicons/core-free-icons/Search01Icon';
import { ActionBar } from '@brumaombra/ui-vintage/action-bar';
import { Avatar, AvatarFallback } from '@brumaombra/ui-vintage/avatar';
import { Badge } from '@brumaombra/ui-vintage/badge';
import { Button } from '@brumaombra/ui-vintage/button';
import { Card, CardMedia, CardTitle } from '@brumaombra/ui-vintage/card';
import { DataListText } from '@brumaombra/ui-vintage/data-list';
import { dialogSizeClasses } from '@brumaombra/ui-vintage/dialog';
import { Input } from '@brumaombra/ui-vintage/input';
import { Progress } from '@brumaombra/ui-vintage/progress';
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

	// The primary badge uses the brand tint
	it('tints the primary badge', async () => {
		const wrapper = await mountSuspended(Badge, { props: { text: 'Sports', color: 'primary' } });
		expect(wrapper.classes()).toContain('text-primary');
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

describe('SectionTitle', () => {
	// The heading level and the icon tile are configurable
	it('renders the title, description and icon', async () => {
		const wrapper = await mountSuspended(SectionTitle, { props: { title: 'Market FAQ', description: 'How it works', icon: SearchIcon, headingLevel: 3 } });
		expect(wrapper.find('h3').text()).toBe('Market FAQ');
		expect(wrapper.text()).toContain('How it works');
		expect(wrapper.find('svg').exists()).toBe(true);
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