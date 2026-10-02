---
title: "Dark Mode Is a Second Design, Not a Filter"
description: "Inverting colors gives you a dark theme that technically works and looks slightly wrong everywhere. Semantic tokens fix most of it. Shadows and accents need extra care."
image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80"
datePublished: "2026-09-08T00:00:00Z"
dateModified: "2026-09-10T00:00:00Z"
author: "Bruma"
authorUrl: "https://brumaombra.com"
authorImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
categorySlug: "design-systems"
categoryText: "Design Systems"
language: "en"
tags: ["Design Systems", "Theming", "CSS"]
faqs:
  - question: "Should dark mode follow the operating system?"
    answer: "As a default, yes. The theme selector in UI Vintage starts in auto mode and follows the system, but lets people pick light or dark explicitly and remembers the choice."
  - question: "Why are dark shadows so much stronger?"
    answer: "Because a shadow needs contrast against the surface behind it. On a dark background, a soft shadow is almost invisible, so the dark theme uses deeper, more opaque values to create the same sense of depth."
---

## The theme that looks almost right

The quickest way to ship dark mode is to swap white for black and black for white. It works, in the sense that text stays readable. It also looks slightly off in a way that is hard to name: shadows vanish, the accent color glares, and every border seems either too loud or missing.

That is because a dark theme is not the light theme with the lights off. Colors behave differently on a dark background, and a few of them need their own decisions.

## Name colors by job, not by shade

The fix that does most of the work is a vocabulary change. Instead of components using `white`, `gray-100`, or `#1b222d`, they use names that describe a job: `background`, `card`, `surface`, `border`, `muted-foreground`. Each theme then decides what those jobs look like.

::Flow
---
title: "How a token becomes a color"
orientation: vertical
items:
  - "A component asks for bg-card"
  - "The token points to --card"
  - "The light or dark theme defines --card"
  - "Every card updates at once"
---
::

In practice, this means a component written once never needs a `dark:` variant for its colors. When the theme changes, every surface changes with it.

### Three things tokens don't solve

That sounds like the whole job, but a few details still need a human eye:

::BlogList
---
variant: numbered
items:
  - "Accent colors need a lighter, slightly warmer value in dark mode, or they glare against the background"
  - "Shadows need much higher opacity, because a soft shadow disappears on a dark surface"
  - "Images and illustrations may need their own dark versions, since tokens can't recolor a photo"
---
::

## Two designs, one vocabulary

The point is not that dark mode is twice the work. With semantic tokens, most of it really is automatic. It is that the remaining part, the accents, the depth, the imagery, deserves the same attention as the light theme. People who choose dark mode often use it all day, and they notice when it was an afterthought.