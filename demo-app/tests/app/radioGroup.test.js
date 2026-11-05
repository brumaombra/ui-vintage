import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import StarIcon from '@hugeicons/core-free-icons/StarIcon';
import { RadioGroup, RadioGroupCard, RadioGroupItem } from '@brumaombra/ui-vintage/radio-group';

// Card radios: the leading visual is the icon tile, or the app's own through the icon slot
describe('RadioGroupCard', () => {
	// The icon prop draws the icon in its tile
	it('draws the icon prop in a tile', async () => {
		const wrapper = await mountSuspended(RadioGroup, {
			slots: { default: () => h(RadioGroupCard, { value: 'pro', label: 'Pro', icon: StarIcon }) }
		});
		expect(wrapper.findAll('svg')).toHaveLength(1);
		expect(wrapper.find('[data-slot="radio-group-card"] .size-9').exists()).toBe(true);
	});

	// The icon slot replaces the tile with the app's own visual, like a flag or a logo
	it('replaces the icon tile with the icon slot', async () => {
		const wrapper = await mountSuspended(RadioGroup, {
			slots: { default: () => h(RadioGroupCard, { value: 'it', label: 'Italiano', icon: StarIcon }, { icon: () => h('img', { alt: 'Flag', src: '/it.svg' }) }) }
		});
		expect(wrapper.find('img[alt="Flag"]').exists()).toBe(true);
		expect(wrapper.find('img[alt="Flag"]').element.parentElement.classList.contains('size-9')).toBe(true); // The same 36px as the tile, so every card has the same height
		expect(wrapper.find('[data-slot="radio-group-card"] svg').exists()).toBe(false); // The icon prop's tile isn't drawn
		expect(wrapper.text()).toContain('Italiano');
	});

	// A card without an icon or a slot shows only its text
	it('leaves the leading visual out without an icon', async () => {
		const wrapper = await mountSuspended(RadioGroup, {
			slots: { default: () => h(RadioGroupCard, { value: 'free', label: 'Free', description: 'For trying it out' }) }
		});
		expect(wrapper.find('[data-slot="radio-group-card"] .size-9').exists()).toBe(false);
		expect(wrapper.text()).toContain('For trying it out');
	});
});

// The group: card lists sit closer together than plain radios
describe('RadioGroup', () => {
	// The tighter gap only applies when the group holds cards (plain radios keep theirs)
	it('tightens the gap of a list of cards only', async () => {
		const wrapper = await mountSuspended(RadioGroup, {
			slots: { default: () => h(RadioGroupItem, { value: 'a' }) }
		});
		const classes = wrapper.find('[data-slot="radio-group"]').classes();
		expect(classes).toContain('gap-3');
		expect(classes).toContain('has-[>[data-slot=radio-group-card]]:gap-2');
	});
});

// Flags come in two sizes: next to a label, or in the space of an icon tile
describe('LanguageFlag', () => {
	// The large flag is 32px wide, the default one stays as it was
	it('draws the large size for icon tiles', async () => {
		const { LanguageFlag } = await import('@brumaombra/ui-vintage/language-flag');
		const large = await mountSuspended(LanguageFlag, { props: { code: 'it', size: 'lg' } });
		await new Promise(resolve => setTimeout(resolve, 50)); // The flag is loaded on demand
		expect(large.find('svg').classes()).toEqual(expect.arrayContaining(['w-8', 'h-6']));
		const regular = await mountSuspended(LanguageFlag, { props: { code: 'it' } });
		await new Promise(resolve => setTimeout(resolve, 50));
		expect(regular.find('svg').classes()).toContain('h-4');
	});
});
