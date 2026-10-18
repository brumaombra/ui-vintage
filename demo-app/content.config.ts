import { defineContentConfig, defineCollection, z } from '@nuxt/content';

export default defineContentConfig({
	collections: {
		// Blog collection
		blog: defineCollection({
			type: 'page',
			source: '**/blog/*.md',
			schema: z.object({
				title: z.string(),
				description: z.string(),
				summary: z.string().optional(), // Short answer shown at the top of the post ("In short" box)
				image: z.string(),
				imageAlt: z.string().optional(),
				datePublished: z.string(),
				dateModified: z.string().optional(),
				author: z.string(),
				authorUrl: z.string(),
				authorImageUrl: z.string(),
				categorySlug: z.string(),
				categoryText: z.string(),
				language: z.string(),
				tags: z.array(z.string()).optional(),
				faqs: z.array(
					z.object({
						question: z.string(),
						answer: z.string()
					})
				).default([])
			})
		})
	}
});