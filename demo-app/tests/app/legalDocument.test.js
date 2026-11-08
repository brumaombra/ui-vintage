import { describe, expect, it } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { LegalDocument } from '@brumaombra/ui-vintage/legal-document';

// A short legal page: two sections, one with points
const props = {
	title: 'Terms of service',
	updated: 'November 1, 2026',
	summary: ['Keep your account safe.', 'No spam.'],
	sections: [
		{ title: 'Introduction', text: 'These terms govern your use of the app.' },
		{ title: 'Your responsibilities', points: [{ title: 'Account', text: 'Keep it safe.' }, { title: 'Content', text: 'No spam.' }] }
	],
	contactText: 'Questions?',
	contactEmail: 'contact@example.com'
};

// The legal page: the short version first, then the full text in collapsible sections
describe('LegalDocument', () => {
	// The title is the page heading, with the date and the short version
	it('shows the title, the date and the short version', async () => {
		const wrapper = await mountSuspended(LegalDocument, { props });
		expect(wrapper.find('h1').text()).toBe('Terms of service');
		expect(wrapper.text()).toContain('Last updated November 1, 2026');
		expect(wrapper.findAll('[data-slot="legal-document-summary"] li').map(item => item.text())).toEqual(['Keep your account safe.', 'No spam.']);
	});

	// The full text is in the page even with every section closed (search engines and the browser's search find it)
	it('keeps the full text in the page, closed at first', async () => {
		const wrapper = await mountSuspended(LegalDocument, { props });
		expect(wrapper.text()).toContain('These terms govern your use of the app.');
		expect(wrapper.findAll('dt').map(term => term.text())).toEqual(['Account', 'Content']);
		expect(wrapper.findAll('[aria-expanded="false"]').length).toBeGreaterThanOrEqual(2);
	});

	// One tap opens every section, and the next closes them again
	it('opens and closes every section at once', async () => {
		const wrapper = await mountSuspended(LegalDocument, { props });
		const toggle = wrapper.findAll('button').find(button => button.text() === 'Expand all');
		await toggle.trigger('click');
		await flushPromises();
		expect(wrapper.findAll('[data-state="open"]')).toHaveLength(2);
		expect(toggle.text()).toBe('Collapse all');
		await toggle.trigger('click');
		await flushPromises();
		expect(wrapper.findAll('[data-state="open"]')).toHaveLength(0);
	});

	// The contact email is a mail link
	it('links the contact email', async () => {
		const wrapper = await mountSuspended(LegalDocument, { props });
		expect(wrapper.find('a[href="mailto:contact@example.com"]').text()).toBe('contact@example.com');
	});

	// Small orange text was 2.2:1 on the light background: the summary label and the email are dark, and the orange stays on a line and an underline
	it('keeps the summary label and the email in the text color', async () => {
		const wrapper = await mountSuspended(LegalDocument, { props });
		const label = wrapper.find('[data-slot="legal-document-summary"] h2');
		const email = wrapper.find('a[href="mailto:contact@example.com"]');
		expect(label.classes()).toContain('text-foreground');
		expect(label.find('span[aria-hidden="true"]').classes()).toContain('bg-primary');
		expect(email.classes()).toEqual(expect.arrayContaining(['text-foreground', 'decoration-primary']));
		expect(email.classes()).not.toContain('text-primary');
	});
});