import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { ListGroup, ListRow } from '@brumaombra/ui-vintage/list';
import { Skeleton } from '@brumaombra/ui-vintage/skeleton';

// Grouped list: each kind of row renders the right element, and opens something only when it should
describe('ListGroup and ListRow', () => {
	// The group shows its title and note around the rows
	it('shows the title, the rows and the note', async () => {
		const wrapper = await mountSuspended(ListGroup, {
			props: { title: 'Preferences', hint: 'Saved at once.' },
			slots: { default: () => h(ListRow, { label: 'Theme' }) }
		});
		expect(wrapper.find('h2').text()).toBe('Preferences');
		expect(wrapper.findAll('li')).toHaveLength(1);
		expect(wrapper.text()).toContain('Saved at once.');
	});

	// A row with a path is a link, with a chevron
	it('links a row to a page', async () => {
		const wrapper = await mountSuspended(ListRow, { props: { label: 'Favourites', to: '/favourites', badge: 3 } });
		expect(wrapper.find('a').attributes('href')).toBe('/favourites');
		expect(wrapper.text()).toContain('3');
		expect(wrapper.findAll('svg')).toHaveLength(1); // The chevron
	});

	// An action row is a button that emits click
	it('emits click from an action row', async () => {
		const wrapper = await mountSuspended(ListRow, { props: { label: 'Language', value: 'English', action: true } });
		await wrapper.find('button').trigger('click');
		expect(wrapper.emitted('click')).toHaveLength(1);
		expect(wrapper.text()).toContain('English');
	});

	// A plain row holds its control, and its label points at it (a tap on the label reaches the control)
	it('labels the control of a plain row', async () => {
		const wrapper = await mountSuspended(ListRow, {
			props: { label: 'Emails', labelFor: 'emails' },
			slots: { trailing: () => h('input', { id: 'emails', type: 'checkbox' }) }
		});
		expect(wrapper.find('button').exists()).toBe(false);
		expect(wrapper.find('a').exists()).toBe(false);
		expect(wrapper.find('label').attributes('for')).toBe('emails');
	});

	// A danger action has no chevron, and the destructive color
	it('marks a destructive action', async () => {
		const wrapper = await mountSuspended(ListRow, { props: { label: 'Delete account', action: true, danger: true } });
		expect(wrapper.find('button').classes()).toContain('text-destructive');
		expect(wrapper.find('svg').exists()).toBe(false);
	});

	// A description adds a second line under the label
	it('shows a description under the label', async () => {
		const wrapper = await mountSuspended(ListRow, { props: { label: 'Rotate all scenes', description: 'One after the other' } });
		expect(wrapper.text()).toContain('Rotate all scenes');
		expect(wrapper.text()).toContain('One after the other');
	});

	// A long value is cut off by default, and wraps when it must show whole (an address, a name)
	it('cuts a long value off, or wraps it', async () => {
		const value = 'gizmo-reolink-switch.local';
		const cut = await mountSuspended(ListRow, { props: { label: 'Hostname', value } });
		const cutValue = cut.findAll('span').find(span => span.text() === value);
		expect(cutValue.classes()).toContain('truncate');

		const wrapped = await mountSuspended(ListRow, { props: { label: 'Hostname', value, wrapValue: true } });
		const wrappedValue = wrapped.findAll('span').find(span => span.text() === value);
		expect(wrappedValue.classes()).toContain('wrap-anywhere');
		expect(wrappedValue.classes()).not.toContain('truncate');
	});

	// Content under the label (a slider, a field) sits outside the button of the row, so a tap on it never opens the row
	it('puts the default slot under the row, outside its button', async () => {
		const wrapper = await mountSuspended(ListRow, {
			props: { label: 'Brightness', value: '60%', action: true },
			slots: { default: () => h('input', { type: 'range', id: 'brightness' }) }
		});
		expect(wrapper.find('button input').exists()).toBe(false);
		expect(wrapper.find('li').element.children).toHaveLength(2); // The row, then the content
		expect(wrapper.find('li').element.lastElementChild.querySelector('input[type="range"]')).not.toBeNull();
	});

	// A row without content has no empty space under it
	it('adds no content block without the default slot', async () => {
		const wrapper = await mountSuspended(ListRow, { props: { label: 'Theme' } });
		expect(wrapper.find('li').element.children).toHaveLength(1); // Only the row itself (a plain row is a div too)
	});
});

// Skeleton: a text line can sit inside a paragraph, with a smaller corner than the blocks
describe('Skeleton', () => {
	// A text line is a span with half the corner radius, a block keeps the corner of every component
	it('renders a text line as a span with a smaller corner', async () => {
		const text = await mountSuspended(Skeleton, { props: { text: true } });
		expect(text.element.tagName).toBe('SPAN');
		expect(text.classes()).toEqual(expect.arrayContaining(['inline-block', 'rounded-[calc(var(--uv-radius)/2)]']));
		expect(text.classes()).not.toContain('rounded');

		const block = await mountSuspended(Skeleton);
		expect(block.element.tagName).toBe('DIV');
		expect(block.classes()).toContain('rounded');
	});
});