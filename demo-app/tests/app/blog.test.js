import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { BlogHeaderSection, BlogInfoSection, BlogPostHeader, BlogSummary, BlogTagsSection, CategoryCard, PostCard } from '@brumaombra/ui-vintage/blog';

// Labels of the details row in the post header
const readDetailLabels = wrapper => wrapper.findAll('dt').map(label => label.text());

// Blog headers: the first thing readers see on every blog page
describe('BlogPostHeader', () => {
	// The author used to be plain text at the top, while the card at the bottom linked it
	it('links the author like the author card', async () => {
		const wrapper = await mountSuspended(BlogPostHeader, { props: { title: 'Post', author: 'Bruma', authorImageUrl: '/bruma.png', authorUrl: 'https://brumaombra.com' } });
		const link = wrapper.find('dd a');
		expect(link.attributes('href')).toBe('https://brumaombra.com');
		expect(link.attributes('target')).toBe('_blank');
		expect(link.text()).toContain('Bruma');

		// Expect the photo to grow on its own hover only, and no link without a URL
		expect(link.find('img').classes()).toContain('hover:scale-110');

		// The photo repeated the name next to it (Lighthouse flagged the redundant alt): it is decorative now
		expect(link.find('img').attributes('alt')).toBe('');
		const plain = await mountSuspended(BlogPostHeader, { props: { title: 'Post', author: 'Bruma' } });
		expect(plain.find('dd a').exists()).toBe(false);
		expect(plain.find('dd').text()).toContain('Bruma');
	});

	// A full post shows the four labelled details
	it('shows author, date, reading time, and category', async () => {
		const wrapper = await mountSuspended(BlogPostHeader, {
			props: { title: 'Shipping the blog', author: 'Bruma', datePublished: '2026-06-14', categoryText: 'Product Updates', categorySlug: 'product-updates', readingMinutes: 6 }
		});
		expect(readDetailLabels(wrapper)).toEqual(['Author', 'Published', 'Reading time', 'Category']);
		expect(wrapper.text()).toContain('June 14, 2026');
		expect(wrapper.text()).toContain('6 min');
	});

	// Columns without data are left out instead of showing empty cells
	it('leaves out the details that are missing', async () => {
		const wrapper = await mountSuspended(BlogPostHeader, { props: { title: 'Draft', readingMinutes: 3 } });
		expect(readDetailLabels(wrapper)).toEqual(['Reading time']);
	});

	// Category and tag links follow the blog base path
	it('builds category and tag links from blogPath', async () => {
		const wrapper = await mountSuspended(BlogPostHeader, {
			props: { title: 'Post', blogPath: '/news', categoryText: 'Design', categorySlug: 'design', tags: [{ name: 'Vue', slug: 'vue' }] }
		});
		const hrefs = wrapper.findAll('a').map(link => link.attributes('href'));
		expect(hrefs).toContain('/news/categories/design');
		expect(hrefs).toContain('/news/tags/vue');
	});

	// Without an explicit value, the reading time comes from the body
	it('estimates the reading time from the body', async () => {
		const wrapper = await mountSuspended(BlogPostHeader, { props: { title: 'Post', body: 'word '.repeat(440) } });
		expect(wrapper.text()).toContain('2 min');
	});
});

describe('BlogSummary', () => {
	// The short answer of the post sits in a labelled region, so readers and assistive technologies find it
	it('shows the summary under the In short label', async () => {
		const wrapper = await mountSuspended(BlogSummary, { props: { summary: 'Springs feel faster because they move early.' } });
		expect(wrapper.attributes('role')).toBe('region');
		expect(wrapper.attributes('aria-label')).toBe('In short');
		expect(wrapper.text()).toContain('In short');
		expect(wrapper.text()).toContain('Springs feel faster because they move early.');
	});
});

describe('BlogTagsSection', () => {
	// Tag chips link to the tag pages under the blog base path
	it('links every tag under blogPath', async () => {
		const wrapper = await mountSuspended(BlogTagsSection, { props: { blogPath: '/journal', tags: [{ name: 'CSS', slug: 'css', count: 3 }] } });
		expect(wrapper.find('a').attributes('href')).toBe('/journal/tags/css');

		// The hover tints are solid: translucent ones let the page grid show through the tag
		expect(wrapper.html()).not.toMatch(/group-hover\/tag:bg-primary\//);
		expect(wrapper.text()).toContain('CSS');
		expect(wrapper.text()).toContain('3');
	});
});

describe('BlogHeaderSection', () => {
	// Centered by default; left and right move the column, its text, and the stats row together
	it('aligns the header content', async () => {
		const stats = [{ label: 'posts', value: 6 }];
		const centered = await mountSuspended(BlogHeaderSection, { props: { title: 'Blog', description: 'Notes', stats } });
		expect(centered.find('header').classes()).toEqual(expect.arrayContaining(['items-center', 'text-center']));
		const left = await mountSuspended(BlogHeaderSection, { props: { title: 'Blog', description: 'Notes', stats, align: 'left' } });
		expect(left.find('header').classes()).toEqual(expect.arrayContaining(['items-start', 'text-left']));
		expect(left.find('[data-slot="stat-strip"]').classes()).toContain('justify-start');
		const right = await mountSuspended(BlogHeaderSection, { props: { title: 'Blog', description: 'Notes', stats, align: 'right' } });
		expect(right.find('header').classes()).toEqual(expect.arrayContaining(['items-end', 'text-right']));
	});

	// The highlighted part of the title is rendered on its own, wherever it appears
	it('highlights part of the title', async () => {
		const wrapper = await mountSuspended(BlogHeaderSection, { props: { title: 'Il blog della demo', highlight: 'blog', description: 'Notes' } });
		const highlight = wrapper.find('h1 span.relative');
		expect(highlight.text()).toBe('blog');

		// The brand orange was 2.2:1 on the light background: in light mode the word is just dark enough for large text, in dark mode it stays the brand orange
		expect(highlight.classes()).toEqual(expect.arrayContaining(['text-[color-mix(in_oklab,var(--primary)_85%,black)]', 'dark:text-primary']));
		expect(wrapper.find('h1').text().replace(/\s+/g, ' ')).toBe('Il blog della demo');
	});

	// No space is added around the highlight unless the title has one there
	it('keeps the title spacing around the highlight', async () => {
		const wrapper = await mountSuspended(BlogHeaderSection, { props: { title: 'The (Nuxt) blog', highlight: 'Nuxt', description: 'Notes' } });
		expect(wrapper.find('h1').text().replace(/\s+/g, ' ')).toBe('The (Nuxt) blog');
	});

	// The announcement links to its target with the translated "New" label
	it('renders the announcement link', async () => {
		const wrapper = await mountSuspended(BlogHeaderSection, { props: { title: 'Blog', description: 'Notes', announcement: { text: 'Latest post', to: '/blog/latest' } } });
		const link = wrapper.find('a');
		expect(link.attributes('href')).toBe('/blog/latest');
		expect(link.text()).toContain('New');
		expect(link.text()).toContain('Latest post');
	});
});

// Author card at the bottom of a post
describe('BlogInfoSection', () => {
	// The photo grew while any part of the row was hovered (the name, the bio): now only the photo itself triggers it
	it('grows the photo only while the photo is hovered', async () => {
		const wrapper = await mountSuspended(BlogInfoSection, { props: { author: 'Bruma', authorUrl: 'https://brumaombra.com', authorImageUrl: '/bruma.png', authorBio: 'Builds things.', datePublished: '2026-06-14' } });
		const row = wrapper.find('[data-slot="blog-author"]');
		const photoLink = row.find('a');
		expect(row.classes().join(' ')).not.toContain('group/author');
		expect(photoLink.classes()).toContain('group/author-image');
		expect(photoLink.find('img').classes()).toContain('group-hover/author-image:scale-110');
	});
});

// Small orange text was 2.2:1 on the light background (Lighthouse color-contrast): it uses the darker ink of the brand orange, or gray with an orange dot
describe('Blog orange text contrast', () => {
	// The category label of a post card
	it('shows the post category in gray with an orange dot', async () => {
		const wrapper = await mountSuspended(PostCard, { props: { title: 'Post', category: 'Design' } });
		const label = wrapper.findAll('span').find(span => span.text() === 'Design' && span.classes().includes('uppercase'));
		expect(label.classes()).toContain('text-muted-foreground');
		expect(label.find('span[aria-hidden="true"]').classes()).toContain('bg-primary');
	});

	// The post count of a category card
	it('writes the category count in the orange ink', async () => {
		const wrapper = await mountSuspended(CategoryCard, { props: { name: 'Design', count: 3 } });
		const count = wrapper.findAll('span').find(span => span.text() === '3');
		expect(count.classes()).toContain('text-primary-ink');
		expect(count.classes()).not.toContain('text-primary');
	});
});