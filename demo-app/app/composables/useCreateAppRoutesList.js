import fs from 'fs/promises';
import path from 'path';
import { slugify } from './useUtils.js';

// List of available locales
const availableLocales = ['en', 'it'];

// Get the static pages
const getStaticPageRoutes = () => {
    return addLocalizationToRoutes([
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
    ]);
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

// Get all blog post paths from content/blog for each locale
const getAllBlogRoutes = async () => {
    const rootDir = process.cwd();
    const routes = [];

    // Loop through each locale to get blog posts
    for (const locale of availableLocales) {
        // Determine the blog directory for each locale
        const blogDir = locale === 'en' ? path.join(rootDir, 'content', 'blog') : path.join(rootDir, 'content', locale, 'blog');

        // Read the blog directory entries
        let entries = [];
        try {
            entries = await fs.readdir(blogDir, { withFileTypes: true });
        } catch (error) {
            continue; // Directory may not exist for some locales, skip
        }

        // Filter and map entries to routes
        for (const entry of entries) {
            if (entry.isFile() && entry.name.endsWith('.md')) {
                const slug = entry.name.replace(/\.md$/, '');
                if (locale === 'en') {
                    routes.push(`/blog/${slug}`);
                } else {
                    routes.push(`/${locale}/blog/${slug}`);
                }
            }
        }
    }

    return routes;
};

// Get all the category routes
const getCategoryRoutes = async () => {
    const categories = await getUniqueCategories(); // Get unique categories from blog posts
    const routes = [];

    // Map categories to routes for each locale
    for (const locale of availableLocales) {
        for (const category of categories) {
            if (locale === 'en') {
                routes.push(`/blog/categories/${category}`); // English routes without locale prefix
            } else {
                routes.push(`/${locale}/blog/categories/${category}`); // Localized routes for other languages
            }
        }
    }

    return routes;
};

// Get all the tag routes
const getTagRoutes = async () => {
    const tags = await getUniqueTags(); // Get unique tags from blog posts
    const routes = [];

    // Map tags to routes for each locale
    for (const locale of availableLocales) {
        for (const tag of tags) {
            if (locale === 'en') {
                routes.push(`/blog/tags/${tag}`); // English routes without locale prefix
            } else {
                routes.push(`/${locale}/blog/tags/${tag}`); // Localized routes for other languages
            }
        }
    }

    return routes;
};

// Get all unique categories from blog post markdowns
const getUniqueCategories = async () => {
    const rootDir = process.cwd();
    const blogDir = path.join(rootDir, 'content/blog'); // Default blog directory for 'en' locale
    const entries = await fs.readdir(blogDir, { withFileTypes: true });
    const categoriesSet = new Set();

    // Loop through entries and extract categories from frontmatter
    for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.md')) {
            const filePath = path.join(blogDir, entry.name);
            const content = await fs.readFile(filePath, 'utf-8');
            const frontmatter = extractFrontmatter(content);

            // Check if category exists in frontmatter
            if (frontmatter.categorySlug) {
                const cleanCategory = frontmatter.categorySlug.replace(/^['"]|['"]$/g, ''); // Remove surrounding quotes if present
                categoriesSet.add(cleanCategory);
            }
        }
    }

    return Array.from(categoriesSet);
};

// Get all unique tags from blog post markdowns (tags are in English in every locale, so they share the same slugs)
const getUniqueTags = async () => {
    const rootDir = process.cwd();
    const blogDir = path.join(rootDir, 'content/blog'); // Default blog directory for 'en' locale
    const entries = await fs.readdir(blogDir, { withFileTypes: true });
    const tagsSet = new Set();

    // Loop through entries and extract tags from frontmatter
    for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.md')) {
            const filePath = path.join(blogDir, entry.name);
            const content = await fs.readFile(filePath, 'utf-8');
            const frontmatter = extractFrontmatter(content);
            const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];

            // Add each tag slug to the set
            for (const tag of tags) {
                const tagSlug = slugify(String(tag).replace(/^['"]|['"]$/g, ''));
                if (tagSlug) tagsSet.add(tagSlug);
            }
        }
    }

    return Array.from(tagsSet);
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
    const blogRoutes = await getAllBlogRoutes(); // Get all blog post routes
    const categoryRoutes = await getCategoryRoutes(); // Get all category routes
    const tagRoutes = await getTagRoutes(); // Get all tag routes

    // Merge and deduplicate
    const routes = Array.from(new Set([
        ...staticRoutes,
        ...blogRoutes,
        ...categoryRoutes,
        ...tagRoutes
    ]));

    return routes;
};
