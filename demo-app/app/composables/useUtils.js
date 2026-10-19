// Address of the site (absolute links for metadata and sharing)
export const SITE_URL = 'https://ui-vintage.brumaombra.com';

// Resolve a demo URL for metadata
const getAbsoluteUrl = value => {
	return new URL(value || '/', SITE_URL).toString();
};

// Create page metadata for the demo blog
export const createSEOMetatags = ({ title = '', description = '', url = '', image = '', type = 'website' }) => {
	const fullUrl = getAbsoluteUrl(url);
	const imageUrl = image ? getAbsoluteUrl(image) : undefined;

	return {
		// Title and description
		title,
		description,

		// Page URL (the canonical link comes from useLocaleHead)
		ogUrl: fullUrl,

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
				url: SITE_URL
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