---
title: "Designing a Reusable Editorial System"
description: "How we turned a one-off blog UI into a reusable content surface that still feels intentional once it leaves the original product."
image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80"
datePublished: "2026-06-10T00:00:00Z"
dateModified: "2026-06-12T00:00:00Z"
author: "Bruma"
authorUrl: "https://brumaombra.com"
authorImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
categorySlug: "design-systems"
categoryText: "Design Systems"
language: "en"
faqs:
  - question: "Why move a blog UI into a shared library?"
    answer: "Because it lets multiple projects reuse the same content surfaces, spacing decisions, and interaction patterns without rebuilding them from scratch."
  - question: "What should stay app-specific?"
    answer: "Content querying, SEO policy, and product-specific conversion blocks usually belong to the app, while reusable cards, lists, sidebars, and info panels fit the library."
---

## Start from the editorial rhythm

Reusable blog UI works best when the typography and spacing rules are stable before you think about product branding. The moment every project needs to reinterpret headings, cards, or metadata blocks, the shared component layer stops saving time.

In this demo, the goal is not to simulate a CMS with endless data. It is to prove that the shared blog components can render a believable article page, category flow, and listing experience with the same surface language across routes.

::BlogList
---
variant: checkmark
items:
  - "Stable typography and spacing make the article page portable across products"
  - "Shared content blocks reduce duplication between markdown-heavy apps"
  - "Wrapper components preserve app-level compatibility while moving real UI into the library"
---
::

### A reusable system needs clear boundaries

The library owns the reusable chrome: hero cards, carousels, category grids, FAQs, author information, and table-of-contents behavior. The demo app owns the content source and route composition.

That boundary is what makes the setup portable. Another project can change the post inventory, author information, or publishing cadence without rewriting the reusable UI blocks.

---

## Real content is a better test than static arrays

Mock arrays are useful for initial exploration, but they hide the real shape of an editorial page. Once content lives in markdown, you immediately verify path handling, frontmatter fields, related content lookups, and rich body rendering.

This is where production-like behavior matters. A working post page is not just a hero image plus a few paragraphs. It includes:

::BlogList
---
variant: circle
items:
  - "Category metadata"
  - "Author and publish information"
  - "A content-driven table of contents"
  - "Related article links"
  - "Related category links"
---
::

::Terminal
---
title: Install the project
commands:
  - npm install
  - npm run dev
---
::

::BlogTable
---
highlightCol: 1
headers: ["Responsibility", "Library", "App"]
rows:
  - ["Editorial UI blocks", "Cards, lists, tables, dividers, TOC, FAQ, author info", "Consumes them through wrappers or direct imports"]
  - ["Content source", "No hardcoded product content", "Markdown entries and route queries"]
  - ["Product-specific conversion blocks", "Optional", "Owns CTA cards like GiveItATryCard"]
---
::

### Markdown helps expose content assumptions

With markdown in the loop, the page has to handle long-form prose and nested headings gracefully. If the spacing, prose styles, or table-of-contents data break, that problem becomes obvious immediately.

## The demo app should behave like a consumer

The demo app is most useful when it exercises the library the same way a real product would. That means importing the published subpaths, relying on the Nuxt modules the production app uses, and querying content through the same APIs instead of bypassing them.

That approach keeps the demo honest. If something is awkward here, it will be awkward for the next consuming app too.