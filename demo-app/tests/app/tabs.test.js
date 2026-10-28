import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@brumaombra/ui-vintage/tabs';

// Mount two tabs, the first one active
const mountTabs = () => mountSuspended(Tabs, {
	props: { modelValue: 'first' },
	slots: {
		default: () => [
			h(TabsList, () => [h(TabsTrigger, { value: 'first' }, () => 'First'), h(TabsTrigger, { value: 'second' }, () => 'Second')]),
			h(TabsContent, { value: 'first' }, () => 'First panel'),
			h(TabsContent, { value: 'second' }, () => 'Second panel')
		]
	}
});

// The panel fades in when the user switches tab, but not with the page (every navigation played it once)
describe('Tabs panel animation', () => {
	// The first panel shows with the page, without the fade
	it('does not animate the first panel', async () => {
		const wrapper = await mountTabs();
		expect(wrapper.find('[data-slot="tabs-content"]').classes()).not.toContain('data-[state=active]:animate-uv-fade-up');
	});

	// The panel shown by a switch fades in
	it('animates the panel shown by a switch', async () => {
		const wrapper = await mountTabs();
		await wrapper.setProps({ modelValue: 'second' });
		const panel = wrapper.find('[data-slot="tabs-content"][id$="content-second"]');
		expect(panel.classes()).toContain('data-[state=active]:animate-uv-fade-up');
	});
});