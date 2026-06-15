import { defineCollection, defineContentConfig } from '@nuxt/content';
import { z } from 'zod';

export default defineContentConfig({
    collections: {
        blog: defineCollection({
            type: 'page',
            source: '**/blog/*.md',
            schema: z.object({
                title: z.string(),
                description: z.string(),
                image: z.string(),
                datePublished: z.string(),
                dateModified: z.string().optional(),
                author: z.string(),
                authorUrl: z.string(),
                authorImageUrl: z.string(),
                categorySlug: z.string(),
                categoryText: z.string(),
                language: z.string(),
                faqs: z.array(z.object({
                    question: z.string(),
                    answer: z.string()
                })).default([])
            })
        })
    }
});