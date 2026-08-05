---
title: "Shipping the Blog Migration Into the Library"
description: "A practical summary of what changed once the original blog implementation was moved into a reusable Nuxt-friendly component library."
image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80"
datePublished: "2026-06-14T00:00:00Z"
dateModified: "2026-06-14T00:00:00Z"
author: "Bruma"
authorUrl: "https://brumaombra.com"
authorImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
categorySlug: "product-updates"
categoryText: "Product Updates"
language: "en"
faqs:
  - question: "Why keep Nuxt Content in the demo app?"
    answer: "Because the demo should validate the same content querying and rendering path that a production consumer would use, not just the visual components in isolation."
  - question: "Why only two example posts?"
    answer: "Two posts are enough to validate the index page, a real detail page, category navigation, related content logic, and shared article components without adding noise."
---

## The migration changes what the demo is proving

Once the blog UI moves into the library, the demo app stops being a static gallery and becomes a real integration surface. It now needs to prove that the components can work with content collections, route params, and markdown rendering rather than fixed arrays alone.

That is a more meaningful test, because it mirrors the way a consuming product actually uses the library.

::BlogList
---
variant: numbered
items:
  - "The page queries real markdown entries instead of rendering hardcoded arrays"
  - "Shared article components now sit behind dedicated library subpath imports"
  - "The demo validates wrappers, content rendering, and route composition together"
---
::

### Production-like does not mean product-specific

The demo does not need every conversion card or SEO helper from the original app. It does need the real data flow: content collection, frontmatter schema, content renderer, related post logic, and category navigation.

---

## Two example posts are enough to validate the route graph

With two posts, the demo can validate the full blog route graph:

::BlogList
---
items:
  - "The /blog index"
  - "The /blog/[slug] article page"
  - "The /blog/categories overview"
  - "The /blog/categories/[slug] listing"
---
::

That is the minimum useful slice for testing whether the migrated components still compose correctly around actual content.

::BlogTable
---
headers: ["Route", "What it validates"]
rows:
  - ["/blog", "Index composition, featured posts, and paginated lists"]
  - ["/blog/[slug]", "Article content, author info, TOC, and related blocks"]
  - ["/blog/categories", "Category aggregation and navigation"]
  - ["/blog/categories/[slug]", "Filtered post listings with pagination"]
---
::

### The content schema matters as much as the components

The article page only works smoothly because the content schema includes the same metadata the UI expects: title, description, image, author, publish dates, category information, language, and FAQs.

If those fields drift, the page becomes brittle. Keeping the schema explicit is part of keeping the library usable.

## Related content should feel deterministic

Even in a small demo, related content should not feel random. Prioritizing same-category posts first keeps the page behavior understandable and closer to what a real product would do.

That is enough for this app. The point is not to recreate a full editorial recommendation engine. The point is to validate that the layout, links, and supporting components work when content is real.