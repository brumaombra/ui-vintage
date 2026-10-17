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

// Prefix a route with the locale (the default locale has no prefix)
const localizeRoute = (locale, route) => {
    return locale === 'en' ? route : `/${locale}${route}`;
};

// Read the blog posts of a locale (slug and frontmatter)
const getBlogPosts = async locale => {
    const rootDir = process.cwd();
    const blogDir = locale === 'en' ? path.join(rootDir, 'content', 'blog') : path.join(rootDir, 'content', locale, 'blog');

    // Read the blog directory entries
    let entries = [];
    try {
        entries = await fs.readdir(blogDir, { withFileTypes: true });
    } catch (error) {
        return []; // Directory may not exist for some locales, skip
    }

    // Parse each markdown file
    const posts = [];
    for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.md')) {
            const content = await fs.readFile(path.join(blogDir, entry.name), 'utf-8');
            posts.push({
                slug: entry.name.replace(/\.md$/, ''),
                frontmatter: extractFrontmatter(content)
            });
        }
    }

    return posts;
};

// Get the post, category and tag routes of every locale
const getBlogRoutes = async () => {
    const routes = [];

    // Loop through each locale (tags are translated, so each locale has its own tag slugs)
    for (const locale of availableLocales) {
        const posts = await getBlogPosts(locale);
        const categories = new Set();
        const tags = new Set();

        // Collect the post routes, categories and tags
        for (const { slug, frontmatter } of posts) {
            routes.push(localizeRoute(locale, `/blog/${slug}`));

            // Category slug
            if (frontmatter.categorySlug) {
                categories.add(frontmatter.categorySlug.replace(/^['"]|['"]$/g, '')); // Remove surrounding quotes if present
            }

            // Tag slugs
            const postTags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
            for (const tag of postTags) {
                const tagSlug = slugify(tag);
                if (tagSlug) tags.add(tagSlug);
            }
        }

        // Map categories and tags to routes
        for (const category of categories) routes.push(localizeRoute(locale, `/blog/categories/${category}`));
        for (const tag of tags) routes.push(localizeRoute(locale, `/blog/tags/${tag}`));
    }

    return routes;
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
            else value = value.replace(/^['"]|['"]$/g, ''); // Remove surrounding quotes
            frontmatter[m[1]] = value;
        }
    }

    return frontmatter;
};

// Main function for build-time route list
export const createAppRoutesList = async () => {
    const staticRoutes = getStaticPageRoutes(); // Get all static page routes
    const blogRoutes = await getBlogRoutes(); // Get all blog post, category and tag routes

    // Merge and deduplicate
    return Array.from(new Set([
        ...staticRoutes,
        ...blogRoutes
    ]));
};
