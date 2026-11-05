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
		expect(wrapper.find('[data-slot="radio-group-card"] .size-9').exists()).toBe(false);
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