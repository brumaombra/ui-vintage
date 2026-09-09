const demoBaseUrl = 'https://ui-vintage-demo.local';

// Create a URL-safe slug from a blog tag label
export const slugify = value => {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Build unique tag data from blog posts
export const buildTagsFromPosts = posts => {
    const tagsBySlug = new Map();

    // Loop through each post and tag
    for (const post of posts) {
        for (const tag of post.tags || []) {
            const slug = slugify(tag);
            // Skip tags that cannot produce a URL slug
            if (!slug) continue;

            const existingTag = tagsBySlug.get(slug);
            // Preserve the first label while accumulating duplicate tags
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

// Resolve a demo URL for metadata
const getAbsoluteUrl = value => {
    return new URL(value || '/', demoBaseUrl).toString();
};

// Create page metadata for the demo blog
export const createSEOMetatags = ({ title = '', description = '', url = '', image = '', type = 'website' }) => {
    const fullUrl = getAbsoluteUrl(url);
    const imageUrl = image ? getAbsoluteUrl(image) : undefined;

    return {
        // Title and description
        title,
        description,

        // Canonical URL
        ogUrl: fullUrl,
        canonical: fullUrl,

        // Open Graph
        ogType: type,
        ogSiteName: 'UI Vintage Demo',
        ogTitle: title,
        ogDescription: description,
        ...(imageUrl ? { ogImage: imageUrl, twitterImage: imageUrl } : {}),

        // Twitter Cards
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description
    };
};

// Create structured data for the demo blog
export const createPageSchema = ({
    title,
    description,
    url = '/',
    image = '',
    isBlogPost = false,
    datePublished = '',
    dateModified = '',
    author = '',
    authorUrl = '',
    authorImageUrl = '',
    breadcrumbs = [],
    faqs = [],
    tags = []
}) => {
    const fullUrl = getAbsoluteUrl(url);
    const schemas = [{
        // WebPage schema
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        description,
        url: fullUrl,
        ...(image ? { image: getAbsoluteUrl(image) } : {})
    }];

    // Blog post schema (if applicable)
    if (isBlogPost) {
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: title,
            description,
            url: fullUrl,
            ...(image ? { image: getAbsoluteUrl(image) } : {}),
            ...(datePublished ? { datePublished } : {}),
            ...(dateModified || datePublished ? { dateModified: dateModified || datePublished } : {}),
            ...(author ? {
                author: {
                    '@type': 'Person',
                    name: author,
                    ...(authorUrl ? { url: getAbsoluteUrl(authorUrl) } : {}),
                    ...(authorImageUrl ? { image: getAbsoluteUrl(authorImageUrl) } : {})
                }
            } : {}),
            publisher: {
                '@type': 'Organization',
                name: 'UI Vintage Demo',
                url: demoBaseUrl
            },
            ...(Array.isArray(tags) && tags.length > 0 ? { keywords: tags.join(', ') } : {})
        });
    }

    // Breadcrumb schema
    if (breadcrumbs.length > 0) {
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbs.map((breadcrumb, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: breadcrumb.name,
                item: getAbsoluteUrl(breadcrumb.item)
            }))
        });
    }

    // FAQ schema
    if (faqs.length > 0) {
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer
                }
            }))
        });
    }

    // Return JSON-LD scripts
    return {
        script: schemas.map((schema, index) => ({
            type: 'application/ld+json',
            key: `demo-ld-json-schema-${index}`,
            textContent: JSON.stringify(schema)
        }))
    };
};