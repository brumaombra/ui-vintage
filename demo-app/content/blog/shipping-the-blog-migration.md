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
tags: ["Nuxt", "Content", "Component Libraries"]
faqs:
  - question: "Why keep Nuxt Content in the demo app?"
    answer: "Because the demo should validate the same content querying and rendering path that a production consumer would use, not just the visual components in isolation."
  - question: "Why only two example posts?"
    answer: "Two posts are enough to validate the index page, a real detail page, category navigation, related content logic, and shared article components without adding noise."
---

## The migration changes what the demo is proving

Once the blog UI moves into the library, the demo app stops being a static gallery and becomes a real integration surface. It now needs to prove that the components can work with content collections, route params, and markdown rendering rather than fixed arrays alone.

That is a more meaningful test, because it mirrors the way a consuming product actually uses the library.

In practice, the integration stays easy to scan when names such as `queryCollection` and `@brumaombra/ui-vintage/content` remain compact inline references.

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

::Flow
---
title: "From markdown to route"
description: "The demo follows the same path as a consuming application."
orientation: horizontal
items:
  - "Markdown entry"
  - "Collection query"
  - "Localized route"
  - "Rendered article"
---
::

::CodeBlock
---
title: "Plain text output"
language: text
code: |
  The article is loaded from Markdown and rendered through the shared blog surface.
---
::

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

```ts
const post = await queryCollection('blog')
  .path(route.path)
  .first();
```

## Related content should feel deterministic

Even in a small demo, related content should not feel random. Prioritizing same-category posts first keeps the page behavior understandable and closer to what a real product would do.

That is enough for this app. The point is not to recreate a full editorial recommendation engine. The point is to validate that the layout, links, and supporting components work when content is real.

## A longer article gives the table of contents room to work

This section intentionally adds more structure so the floating table of contents can be tested with a realistic amount of navigation.

### Start with the reading context

The first subsection gives the reader a clear place to begin before the article branches into smaller topics.

### Keep each section focused

Short, focused sections make a long table of contents easier to scan even when the navigation itself needs to scroll.

### Leave room for the next idea

Consistent spacing between sections helps the active heading remain easy to identify while reading.

## Heading density changes the navigation rhythm

More headings make it easier to see whether active-state tracking and nested heading indentation continue to work together.

### Compare primary sections

Primary sections should remain visually stronger than their subtitles in both the in-flow and floating versions of the navigation.

### Compare supporting subtitles

Supporting subtitles should stay readable without making the navigation card grow beyond the viewport.

### Follow the active chapter

As the reader moves down the page, the highlighted entry should continue to follow the visible heading.

## A docked navigation needs a bounded height

The floating card should remain available without covering an unreasonable amount of the article or extending below the viewport.

### Test a short viewport

A shorter viewport should make the navigation list scroll internally instead of pushing the card outside the screen.

### Test a wide viewport

At wider desktop sizes, the card can show more entries while keeping the same relationship to the prose container.

### Test repeated heading levels

Repeated h2 and h3 pairs make indentation, spacing, and active styling easier to inspect.

## Long navigation should remain keyboard friendly

The table of contents is also a keyboard navigation surface, so a larger list should not change its focus behavior.

### Move through the list with Tab

Each heading link should remain reachable in document order whether the card is in flow or docked.

### Activate a distant heading

Selecting a heading near the end of the list should close the mobile overlay when needed and scroll to the matching content.

### Return focus after closing

When the mobile navigation closes, focus should return to its trigger so the reading flow remains predictable.

## The active heading should survive dense content

Dense articles are useful for checking whether the observer keeps the correct chapter active around section boundaries.

### Enter a new section

The active state should change when a new primary heading enters the reading window.

### Pass through a subtitle

Subtitles should be able to become active without losing their parent section from the overall navigation structure.

### Reach the final section

The last entries should remain selectable even when they begin below the visible portion of the floating list.

## A stress test should still feel like an article

The extra headings are deliberately lightweight, but they preserve the kind of hierarchy a longer production post might use.

### Keep the prose meaningful

Each heading should introduce a small idea rather than existing only as a repeated placeholder.

### Preserve the visual cadence

Paragraphs between headings make it possible to inspect scrolling, spacing, and heading offsets together.

### Finish with a clear conclusion

A final group of subtitles gives the TOC a complete ending to track and keeps the test content easy to remove later.