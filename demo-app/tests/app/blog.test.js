import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { BlogHeaderSection, BlogPostHeader, BlogTagsSection } from '@brumaombra/ui-vintage/blog';

// Labels of the details row in the post header
const readDetailLabels = wrapper => wrapper.findAll('dt').map(label => label.text());

// Blog headers: the first thing readers see on every blog page
describe('BlogPostHeader', () => {
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

describe('BlogTagsSection', () => {
    // Tag chips link to the tag pages under the blog base path
    it('links every tag under blogPath', async () => {
        const wrapper = await mountSuspended(BlogTagsSection, { props: { blogPath: '/journal', tags: [{ name: 'CSS', slug: 'css', count: 3 }] } });
        expect(wrapper.find('a').attributes('href')).toBe('/journal/tags/css');
        expect(wrapper.text()).toContain('CSS');
        expect(wrapper.text()).toContain('3');
    });
});

describe('BlogHeaderSection', () => {
    // The highlighted part of the title is rendered on its own, wherever it appears
    it('highlights part of the title', async () => {
        const wrapper = await mountSuspended(BlogHeaderSection, { props: { title: 'Il blog della demo', highlight: 'blog', description: 'Notes' } });
        expect(wrapper.find('h1 .text-primary').text()).toBe('blog');
        expect(wrapper.find('h1').text().replace(/\s+/g, ' ')).toBe('Il blog della demo');
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
