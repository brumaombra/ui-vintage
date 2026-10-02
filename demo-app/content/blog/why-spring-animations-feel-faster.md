---
title: "Why Spring Animations Feel Faster Than They Are"
description: "A spring that overshoots slightly can take longer than a plain fade and still feel quicker. Here is why, and where the trick stops working."
image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1400&q=80"
datePublished: "2026-07-02T00:00:00Z"
dateModified: "2026-07-02T00:00:00Z"
author: "Bruma"
authorUrl: "https://brumaombra.com"
authorImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
categorySlug: "motion-design"
categoryText: "Motion Design"
language: "en"
tags: ["Motion", "CSS", "UX"]
faqs:
  - question: "Do spring animations need a JavaScript library?"
    answer: "Not anymore. The CSS linear() function can describe a spring curve directly, so the browser runs it like any other easing, with no script on the main thread."
  - question: "Should every animation use a spring?"
    answer: "No. Springs suit things that move into place, like panels, indicators, and check marks. Elements that leave the screen usually feel better with a short, plain ease-out."
---

## The stopwatch and the feeling disagree

Open a dropdown that fades in over 200 milliseconds, then open one that springs in over 380. Most people will tell you the second one felt faster. That sounds backwards, but it is a pretty reliable result, and it is the reason the UI Vintage components lean on springs for almost everything that moves into place.

So, what is going on? The short version is that we don't judge speed by when an animation ends. We judge it by when something useful appears.

## Most of the motion happens early

A spring curve front-loads its movement. In the first third of the animation the element covers most of the distance, then spends the remaining time settling, sometimes nudging slightly past its target and back. A linear or symmetric curve does the opposite: it eases in, so the first frames barely move at all.

For this reason, a spring reaches "readable" sooner, even when its total duration is longer. The settle at the end reads as polish rather than waiting.

::BlogList
---
variant: checkmark
items:
  - "Panels and menus reach their final position early, so content is readable almost immediately"
  - "A small overshoot signals that the motion is physical, which makes the result feel intentional"
  - "Indicators that follow a selection, like tab underlines, look connected to the user's input"
---
::

## Writing a spring in plain CSS

Until recently, a convincing spring meant a JavaScript animation library. The `linear()` easing function changed that: it accepts a list of points, so you can sample a spring curve once and hand it to the browser.

::CodeBlock
---
title: "A spring easing as a CSS custom property"
language: "css"
code: |
  :root {
      --ease-spring: linear(0, 0.0292 1.6%, 0.4254 8.4%, 0.6922 13.7%,
          0.8729 19.8%, 0.9764 27.2%, 1.0173 36.7%, 1.0201 43.1%, 1);
  }

  .menu[data-state="open"] {
      animation: float-in 380ms var(--ease-spring) both;
  }
---
::

The browser runs this exactly like `ease-out`, so it stays smooth even when the main thread is busy.

### Where the trick stops working

Okay, but springs are not free. An overshoot on something large, like a full-screen sheet, can feel wobbly rather than lively. And on exits, the settle phase is pure delay: nobody wants to watch a menu bounce while it disappears.

The rule the library follows is simple. Springs bring things in, short ease-out curves take them away, and users who ask for reduced motion get no movement at all. That last part matters more than any curve, because for some readers motion is not a matter of taste.

The point is not that springs are always better. It is that perceived speed depends on when the screen becomes useful, and a good curve lets you spend a little more time without making anyone wait for it.