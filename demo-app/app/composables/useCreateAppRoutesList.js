import fs from 'fs/promises';
import path from 'path';

// ---------------------------------- Settings of this app ----------------------------------

// List of available locales
const availableLocales = ['en', 'it'];

// Pages that exist in every locale (the locale prefix is added for the other languages)
const staticPages = [
	'/',
	'/foundations',
	'/components/actions',
	'/components/forms',
	'/components/data-display',
	'/components/navigation',
	'/components/overlays',
	'/components/feedback',
	'/layouts',
	'/blog',
	'/blog/categories',
	'/blog/tags'
];

// Blog: content folder of the posts ('' for the content root), path of the posts, categories and tags, and whether there are tag pages (null without a blog)
const blog = { folder: 'blog', basePath: '/blog', tags: true };

// Other content folders whose markdown files are pages, with their path (e.g. content/projects/clock.md -> /projects/clock)
const contentPageSections = [];

// Get the other routes of this app
const getExtraRoutes = async () => [];

// ---------------------------------- Route engine (shared by the apps) ----------------------------------

// Get the static pages
const getStaticPageRoutes = () => {
	return addLocalizationToRoutes(staticPages);
};

// Add the locale prefix to each route
const addLocalizationToRoutes = routes => {
	const localizedRoutes = [];
	for (const locale of availableLocales) {
		if (locale === 'en') continue; // Skip the default locale
		for (const route of routes) {
			localizedRoutes.push(`/${locale}${route === '/' ? '' : route}`);
		}
	}

	// Return the original routes plus the localized routes
	return [...routes, ...localizedRoutes];
};

// Get the folder of a content section for a locale (e.g. content/it/blog), the English one has no locale folder
const getContentDir = ({ folder, locale }) => {
	return path.join(process.cwd(), 'content', ...(locale === 'en' ? [] : [locale]), ...(folder ? [folder] : []));
};

// Get the routes of the markdown pages of a content section, for each locale (e.g. content/it/blog/post.md -> /it/blog/post)
const getContentPageRoutes = async ({ folder, basePath }) => {
	const routes = [];

	// Loop through each locale to get the pages
	for (const locale of availableLocales) {
		// Read the directory entries
		let entries = [];
		try {
			entries = await fs.readdir(getContentDir({ folder, locale }), { withFileTypes: true });
		} catch (error) {
			continue; // Directory may not exist for some locales, skip
		}

		// Filter and map entries to routes
		for (const entry of entries) {
			if (entry.isFile() && entry.name.endsWith('.md')) {
				const slug = entry.name.replace(/\.md$/, '');
				routes.push(locale === 'en' ? `${basePath}/${slug}` : `/${locale}${basePath}/${slug}`);
			}
		}
	}

	return routes;
};

// Map a list of slugs to their routes under a path, for each locale
const getSlugRoutes = ({ slugs, basePath }) => {
	const routes = [];

	// Map the slugs to routes for each locale
	for (const locale of availableLocales) {
		for (const slug of slugs) {
			if (locale === 'en') {
				routes.push(`${basePath}/${slug}`); // English routes without locale prefix
			} else {
				routes.push(`/${locale}${basePath}/${slug}`); // Localized routes for other languages
			}
		}
	}

	return routes;
};

// Read the frontmatter of every English blog post
const readBlogFrontmatters = async () => {
	const blogDir = getContentDir({ folder: blog.folder, locale: 'en' });
	const entries = await fs.readdir(blogDir, { withFileTypes: true });
	const frontmatters = [];

	// Loop through the markdown files and extract their frontmatter
	for (const entry of entries) {
		if (entry.isFile() && entry.name.endsWith('.md')) {
			const content = await fs.readFile(path.join(blogDir, entry.name), 'utf-8');
			frontmatters.push(extractFrontmatter(content));
		}
	}

	return frontmatters;
};

// Get all unique categories from blog post markdowns
const getUniqueCategories = async () => {
	const categoriesSet = new Set();

	// Check if category exists in frontmatter
	for (const frontmatter of await readBlogFrontmatters()) {
		if (frontmatter.categorySlug) {
			const cleanCategory = frontmatter.categorySlug.replace(/^['"]|['"]$/g, ''); // Remove surrounding quotes if present
			categoriesSet.add(cleanCategory);
		}
	}

	return Array.from(categoriesSet);
};

// Get all unique tags from blog post markdowns (tags are in English in every locale, so they share the same slugs)
const getUniqueTags = async () => {
	const tagsSet = new Set();

	// Add each tag slug to the set
	for (const frontmatter of await readBlogFrontmatters()) {
		const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
		for (const tag of tags) {
			const cleanTag = String(tag).replace(/^['"]|['"]$/g, '').trim();
			if (!cleanTag) continue;

			const tagSlug = cleanTag
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-+|-+$/g, '');

			if (tagSlug) tagsSet.add(tagSlug);
		}
	}

	return Array.from(tagsSet);
};

// Get the routes of the blog: posts, categories and tags
const getBlogRoutes = async () => {
	if (!blog) return []; // This app has no blog

	// Get the post, category and tag routes
	const postRoutes = await getContentPageRoutes({ folder: blog.folder, basePath: blog.basePath });
	const categoryRoutes = getSlugRoutes({ slugs: await getUniqueCategories(), basePath: `${blog.basePath}/categories` });
	const tagRoutes = blog.tags ? getSlugRoutes({ slugs: await getUniqueTags(), basePath: `${blog.basePath}/tags` }) : [];

	return [...postRoutes, ...categoryRoutes, ...tagRoutes];
};

// Extract frontmatter from markdown content
const extractFrontmatter = markdown => {
	const match = /^---\s*([\s\S]*?)\s*---/.exec(markdown);
	if (!match) return {};
	const yaml = match[1];
	const lines = yaml.split('\n');
	const frontmatter = {};

	// Parse each line in the frontmatter
	for (const line of lines) {
		const m = /^(\w+):\s*(.*)$/.exec(line.trim());
		if (m) {
			let value = m[2].trim();
			if (value.startsWith('[') && value.endsWith(']')) value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')); // Handle arrays
			frontmatter[m[1]] = value;
		}
	}

	return frontmatter;
};

// Main function for build-time route list
export const createAppRoutesList = async () => {
	const staticRoutes = getStaticPageRoutes(); // Get all static page routes
	const blogRoutes = await getBlogRoutes(); // Get all blog post, category and tag routes

	// Get the pages of the other content sections
	const contentPageRoutes = [];
	for (const section of contentPageSections) {
		contentPageRoutes.push(...await getContentPageRoutes(section));
	}

	// Get the routes specific to this app
	const extraRoutes = await getExtraRoutes();

	// Merge and deduplicate
	const routes = Array.from(new Set([
		...staticRoutes,
		...blogRoutes,
		...contentPageRoutes,
		...extraRoutes
	]));

	return routes;
};