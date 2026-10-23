// Post fields read by the blog page helpers (a Nuxt Content blog collection entry)
export interface BlogPostData {
	path?: string;
	title?: string;
	description?: string;
	summary?: string;
	image?: string;
	imageAlt?: string;
	categoryText?: string;
	categorySlug?: string;
	tags?: string[];
	[key: string]: unknown;
}

// Category card data built from the posts
export interface BlogCategoryData {
	name: string;
	slug: string;
	path: string;
	count: number;
	image?: string;
}

// Tag badge data built from the posts
export interface BlogTagData {
	name: string;
	slug: string;
	count: number;
}

// Turn a label into a URL slug (e.g. "Dark Mode" -> "dark-mode")
export const slugify = (value: unknown) => {
	return String(value || '')
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
};

// Remove the trailing slashes of a route path, since content paths never have one ("/blog/post/" -> "/blog/post")
export const normalizeContentPath = (path: string) => path.replace(/(.)\/+$/, '$1');

// Build the unique categories of the posts, with their post count and the image of their first post (the path is the blog category page by default)
export const buildCategoriesFromPosts = (posts: BlogPostData[], getPath: (slug: string) => string = slug => `/blog/categories/${slug}`): BlogCategoryData[] => {
	const categoriesList = posts.map(post => post.categorySlug);
	const uniqueCategories = categoriesList.filter((category, index, self): category is string => !!category && self.indexOf(category) === index);

	// Map unique categories to category data
	return uniqueCategories.map(category => {
		const firstPost = posts.find(post => post.categorySlug === category);

		// Return category data
		return {
			name: firstPost?.categoryText || category,
			slug: category,
			path: getPath(category),
			count: categoriesList.filter(item => item === category).length,
			image: firstPost?.image
		};
	});
};

// Build the unique tags of the posts, with their number of uses (the first label wins for tags that share a slug)
export const buildTagsFromPosts = (posts: BlogPostData[]): BlogTagData[] => {
	const tagsBySlug = new Map<string, BlogTagData>();

	// Loop through each post and tag
	for (const post of posts) {
		for (const tag of post.tags || []) {
			const slug = slugify(tag);
			if (!slug) continue; // Skip tags that cannot produce a URL slug

			// Preserve the first label while counting the duplicates
			const existingTag = tagsBySlug.get(slug);
			tagsBySlug.set(slug, {
				name: existingTag?.name || tag,
				slug,
				count: (existingTag?.count || 0) + 1
			});
		}
	}

	// Return unique tags with their post counts
	return [...tagsBySlug.values()];
};

// Create a deterministic hash for stable related content ordering (FNV-1a: a linear hash would give every seed the same order)
const hashString = (value: string) => {
	let hash = 2166136261;
	for (let index = 0; index < value.length; index++) {
		hash ^= value.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}
	return hash >>> 0;
};

// Sort a list by a deterministic score derived from a seed (the same post always shows the same related items, on the server and in the browser)
export const sortByStableSeed = <T>(items: T[], seed: string, getKey: (item: T) => string) => {
	return [...items].sort((itemA, itemB) => hashString(`${seed}-${getKey(itemA)}`) - hashString(`${seed}-${getKey(itemB)}`));
};