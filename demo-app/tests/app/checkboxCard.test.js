import { describe, expect, it } from 'vitest';
import { h, ref } from 'vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import StarIcon from '@hugeicons/core-free-icons/StarIcon';
import { CheckboxCard, CheckboxGroup } from '@brumaombra/ui-vintage/checkbox';

// Card checkboxes: the leading visual is the icon tile, or the app's own through the icon slot
describe('CheckboxCard', () => {
	// The icon prop draws the icon in its tile, next to the label and description
	it('draws the icon prop in a tile', async () => {
		// Mount a card with an icon
		const wrapper = await mountSuspended(CheckboxCard, { props: { label: 'Backups', description: 'Kept for 30 days', icon: StarIcon } });

		// Expect the tile, the icon, the check mark and both texts
		expect(wrapper.find('[data-slot="checkbox-card"] .size-9').exists()).toBe(true);
		expect(wrapper.findAll('svg')).toHaveLength(2); // The icon and the check mark
		expect(wrapper.text()).toContain('Backups');
		expect(wrapper.text()).toContain('Kept for 30 days');
	});

	// The icon slot replaces the tile with the app's own visual, like an avatar
	it('replaces the icon tile with the icon slot', async () => {
		// Mount a card with both an icon and the icon slot
		const wrapper = await mountSuspended(CheckboxCard, {
			props: { label: 'chiara', icon: StarIcon },
			slots: { icon: () => h('img', { alt: 'Avatar', src: '/chiara.png' }) }
		});

		// Expect the slot in the same 36px as the tile, and no icon tile
		expect(wrapper.find('img[alt="Avatar"]').element.parentElement.classList.contains('size-9')).toBe(true);
		expect(wrapper.findAll('svg')).toHaveLength(1); // Only the check mark
	});

	// On its own, the card toggles a boolean v-model from a tap anywhere on it
	it('toggles a boolean model when the card is tapped', async () => {
		// Mount a standalone card bound to a boolean
		const isChecked = ref(false);
		const wrapper = await mountSuspended(CheckboxCard, {
			props: { label: 'Alerts', modelValue: isChecked.value, 'onUpdate:modelValue': value => { isChecked.value = value; } }
		});

		// Tap the card
		await wrapper.find('[data-slot="checkbox-card"]').trigger('click');

		// Expect the model to be checked
		expect(isChecked.value).toBe(true);
	});
});

// The group: the model is the array of checked values, and card lists sit closer together
describe('CheckboxGroup', () => {
	// Mount a group of three cards, the last one disabled
	const mountGroup = async model => {
		return mountSuspended(CheckboxGroup, {
			props: { modelValue: model.value, 'onUpdate:modelValue': value => { model.value = value; } },
			slots: {
				default: () => [
					h(CheckboxCard, { value: 'chiara', label: 'chiara' }),
					h(CheckboxCard, { value: 'sofia', label: 'sofia' }),
					h(CheckboxCard, { value: 'anna', label: 'anna', disabled: true })
				]
			}
		});
	};

	// Tapping cards adds and removes their values
	it('adds and removes values when cards are tapped', async () => {
		// Mount the group with one friend checked
		const model = ref(['chiara']);
		const wrapper = await mountGroup(model);
		const cards = wrapper.findAll('[data-slot="checkbox-card"]');

		// Expect the checked card to show it
		expect(cards[0].attributes('data-state')).toBe('checked');
		expect(cards[1].attributes('data-state')).toBe('unchecked');

		// Tap the second card, then the first one
		await cards[1].trigger('click');
		expect(model.value).toEqual(['chiara', 'sofia']);
		await wrapper.setProps({ modelValue: model.value });
		await cards[0].trigger('click');

		// Expect only the second friend left
		expect(model.value).toEqual(['sofia']);
	});

	// A disabled card can't be checked
	it('ignores taps on a disabled card', async () => {
		// Mount the group with nothing checked
		const model = ref([]);
		const wrapper = await mountGroup(model);

		// Tap the disabled card
		const disabledCard = wrapper.findAll('[data-slot="checkbox-card"]')[2];
		await disabledCard.trigger('click');

		// Expect the model to stay empty
		expect(disabledCard.attributes('disabled')).toBeDefined();
		expect(model.value).toEqual([]);
	});

	// The tighter gap only applies when the group holds cards
	it('tightens the gap of a list of cards only', async () => {
		// Mount the group
		const wrapper = await mountGroup(ref([]));

		// Expect the card gap class
		expect(wrapper.find('[data-slot="checkbox-group"]').classes()).toContain('has-[>[data-slot=checkbox-card]]:gap-2');
	});
});