import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { CardTitle } from '@brumaombra/ui-vintage/card';
import { EmptyStateCard } from '@brumaombra/ui-vintage/empty-state-card';
import { LoadingStateCard } from '@brumaombra/ui-vintage/loading-state-card';
import { PageHeader } from '@brumaombra/ui-vintage/page-header';

// Every component that renders a heading picks its tag with headingLevel (the components named it level or headingLevel; level still works, deprecated)
describe('headingLevel', () => {
	// The default tags stay as they were
	it('keeps the default tags', async () => {
		expect((await mountSuspended(CardTitle, { slots: { default: () => 'Title' } })).find('h3').exists()).toBe(true);
		expect((await mountSuspended(EmptyStateCard, { props: { title: 'Nothing here' } })).find('h3').exists()).toBe(true);
		expect((await mountSuspended(LoadingStateCard, { props: { title: 'Loading' } })).find('h3').exists()).toBe(true);
		expect((await mountSuspended(PageHeader, { props: { title: 'Page' } })).find('h1').exists()).toBe(true);
	});

	// headingLevel sets the tag
	it('renders the level it gets', async () => {
		expect((await mountSuspended(CardTitle, { props: { headingLevel: 2 }, slots: { default: () => 'Title' } })).find('h2').exists()).toBe(true);
		expect((await mountSuspended(EmptyStateCard, { props: { title: 'Nothing here', headingLevel: 2 } })).find('h2').exists()).toBe(true);
		expect((await mountSuspended(LoadingStateCard, { props: { title: 'Loading', headingLevel: 4 } })).find('h4').exists()).toBe(true);
		expect((await mountSuspended(PageHeader, { props: { title: 'Page', headingLevel: 2 } })).find('h2').exists()).toBe(true);
	});

	// The old name still works, and the new one wins when both are given
	it('still reads the deprecated level', async () => {
		expect((await mountSuspended(CardTitle, { props: { level: 1 }, slots: { default: () => 'Title' } })).find('h1').exists()).toBe(true);
		expect((await mountSuspended(CardTitle, { props: { level: 1, headingLevel: 4 }, slots: { default: () => 'Title' } })).find('h4').exists()).toBe(true);
	});
});