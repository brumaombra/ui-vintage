---
title: "Designing Focus States People Actually Notice"
description: "Keyboard users rely on the focus ring to know where they are. Most designs hide it or make it faint. A few small rules make it both visible and good-looking."
image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1400&q=80"
datePublished: "2026-07-21T00:00:00Z"
dateModified: "2026-07-24T00:00:00Z"
author: "Bruma"
authorUrl: "https://brumaombra.com"
authorImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
categorySlug: "accessibility"
categoryText: "Accessibility"
language: "en"
tags: ["Accessibility", "CSS", "Design Systems"]
faqs:
  - question: "Why use focus-visible instead of focus?"
    answer: "The :focus-visible selector only matches when the browser thinks a visible indicator helps, which usually means keyboard navigation. Mouse users don't see a ring after every click, and keyboard users always do."
  - question: "Is a color change enough to show focus?"
    answer: "Usually not. A color change alone can be missed by people with low vision or color blindness. A ring or outline that changes the shape around the element is much easier to spot."
---

## The ring that everyone removes

If you have ever pressed Tab on a website and lost track of where you were, you have met the most common accessibility bug on the web. Someone removed the focus outline because it looked ugly, and nothing replaced it.

It is an understandable decision. Default browser outlines rarely match a design. But for people who navigate with a keyboard, the focus indicator is the cursor. Without it, the page is effectively blind.

## Visible, not loud

The important distinction is between a focus state that is **visible** and one that is **distracting**. The goal is a ring you can't miss when you are looking for it and barely notice when you are not.

In UI Vintage, every interactive element uses the same recipe: a three-pixel ring in the primary color at partial opacity, drawn outside the element so it never shifts the layout.

::BlogTable
---
headers: ["Approach", "Visible to keyboard users", "Bothers mouse users", "Survives custom styles"]
rows:
  - ["Browser default outline", "Yes", "Sometimes", "Often lost"]
  - ["outline: none", "No", "No", "Not applicable"]
  - ["Color change only", "Barely", "No", "Yes"]
  - ["Ring on :focus-visible", "Yes", "No", "Yes"]
highlightCol: 1
---
::

### Contrast still applies

That sounds simple, but a ring is only useful if it stands out from both the element and the page behind it. An orange ring on an orange button disappears. The fix is a thin gap between the element and the ring, usually the page background color, so the ring always has something to contrast against.

## Test it the boring way

There is no shortcut here. Unplug the mouse, or just stop touching it, and walk through a page with Tab, Shift+Tab, Enter, and the arrow keys. If you can't tell where you are at any point, a reader can't either.

The point is not to add decoration. It is to make sure the page answers one question at every moment: where am I? A good focus state answers it quietly, and the design usually looks better for it.