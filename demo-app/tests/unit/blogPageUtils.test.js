import { describe, expect, it } from 'vitest';
import { buildCategoriesFromPosts, buildTagsFromPosts, normalizeContentPath, slugify, sortByStableSeed } from '../../../src/components/blog/blogPageUtils';

// Slugs: tag and category URLs are built from their labels
describe('slugify', () => {
	// Spaces and symbols become single dashes, without dashes at the ends
	it('turns a label into a URL slug', () => {
		expect(slugify(' Dark Mode & Theming! ')).toBe('dark-mode-theming');
	});

	// Labels with no letters or digits can't produce a URL
	it('returns an empty slug for empty or symbol-only labels', () => {
		expect(slugify('')).toBe('');
		expect(slugify(undefined)).toBe('');
		expect(slugify('!!!')).toBe('');
	});
});

// Content paths: a post URL may end with a slash, its Nuxt Content path never does
describe('normalizeContentPath', () => {
	// The post used to be "not found" when the URL had a trailing slash
	it('removes the trailing slashes but keeps the root', () => {
		expect(normalizeContentPath('/blog/my-post/')).toBe('/blog/my-post');
		expect(normalizeContentPath('/it/blog/my-post//')).toBe('/it/blog/my-post');
		expect(normalizeContentPath('/blog/my-post')).toBe('/blog/my-post');
		expect(normalizeContentPath('/')).toBe('/');
	});
});

// Categories: one card per category, in the order of the posts (newest first when the posts are)
describe('buildCategoriesFromPosts', () => {
	const posts = [
		{ categorySlug: 'guides', categoryText: 'Guides', image: '/newest-guide.jpg' },
		{ categorySlug: 'news', categoryText: 'News', image: '/news.jpg' },
		{ categorySlug: 'guides', categoryText: 'Guides', image: '/older-guide.jpg' },
		{ categorySlug: '', categoryText: 'Uncategorized' }
	];

	// Each category counts its posts and shows the image of its first post
	it('builds unique categories with their count, path and first image', () => {
		expect(buildCategoriesFromPosts(posts, slug => `/it/blog/categories/${slug}`)).toEqual([
			{ name: 'Guides', slug: 'guides', path: '/it/blog/categories/guides', count: 2, image: '/newest-guide.jpg' },
			{ name: 'News', slug: 'news', path: '/it/blog/categories/news', count: 1, image: '/news.jpg' }
		]);
	});

	// Without a path builder the cards link to the blog category pages (localized by the links)
	it('links the categories to the blog category pages by default', () => {
		expect(buildCategoriesFromPosts(posts).map(category => category.path)).toEqual(['/blog/categories/guides', '/blog/categories/news']);
	});
});

// Tags: one badge per slug, counting how many posts use it
describe('buildTagsFromPosts', () => {
	// Labels that share a slug are merged, the first label wins
	it('merges tags with the same slug and counts their uses', () => {
		const posts = [{ tags: ['Dark Mode', 'CSS'] }, { tags: ['dark mode', ''] }, {}];
		expect(buildTagsFromPosts(posts)).toEqual([
			{ name: 'Dark Mode', slug: 'dark-mode', count: 2 },
			{ name: 'CSS', slug: 'css', count: 1 }
		]);
	});
});

// Related content: the same post must show the same related items on the server and in the browser
describe('sortByStableSeed', () => {
	const items = ['a', 'b', 'c', 'd', 'e', 'f'];

	// Same seed, same order, without changing the original list
	it('returns the same order for the same seed', () => {
		const first = sortByStableSeed(items, 'en-post', item => item);
		expect(sortByStableSeed(items, 'en-post', item => item)).toEqual(first);
		expect(items).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
	});

	// Different posts get a different mix
	it('changes the order with the seed', () => {
		expect(sortByStableSeed(items, 'en-post-one', item => item)).not.toEqual(sortByStableSeed(items, 'en-post-two', item => item));
	});
});