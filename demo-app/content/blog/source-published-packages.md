---
title: "Shipping a Vue Library Without a Build Step"
description: "UI Vintage publishes its source and lets each Nuxt app compile it. That choice removes a whole class of problems, and adds a couple of new ones."
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80"
datePublished: "2026-08-12T00:00:00Z"
dateModified: "2026-08-12T00:00:00Z"
author: "Bruma"
authorUrl: "https://brumaombra.com"
authorImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
categorySlug: "engineering"
categoryText: "Engineering"
language: "en"
tags: ["Nuxt", "Component Libraries", "Tooling"]
faqs:
  - question: "Does publishing source make apps slower to build?"
    answer: "A little, because the app compiles the library along with its own code. In practice the difference is small, and the app only compiles the components it actually imports."
  - question: "Can a non-Nuxt Vue app use the package?"
    answer: "Not directly. The components rely on Nuxt features such as NuxtImg and the module that injects styles and translations."
---

## Most libraries ship a second copy of themselves

A typical component library has two versions of its code: the source you edit and a compiled bundle in `dist/` that you publish. Keeping them in sync is a job of its own, with a bundler config, declaration files, and the occasional bug that only exists in the build.

UI Vintage skips the second copy. The npm package contains the `.vue` and `.ts` files as they are written, and the Nuxt module tells each app to compile them like its own code.

## What you get for free

The obvious win is less tooling. The less obvious one is that the library behaves exactly like app code, because it is compiled by the same tools with the same settings.

::Flow
---
title: "From install to page"
description: "The library never builds itself. The app does it once, together with everything else."
orientation: horizontal
items:
  - "npm install"
  - "Module registers"
  - "App compiles source"
  - "Tree-shaken page"
---
::

Tailwind scans the library's templates directly, so every utility class a component uses ends up in the app's stylesheet. Vite tree-shakes per subpath import, so a page that only uses a button never loads the date picker.

::CodeBlock
---
title: "Installing the library"
language: "bash"
code: |
  npm install @brumaombra/ui-vintage
  npx nuxi module add @brumaombra/ui-vintage
---
::

### The tradeoffs are real

The strongest argument against this approach is that it ties the library to its framework. A compiled bundle could, in theory, run in any Vue app. A source package needs the toolchain it was written for, which here means Nuxt.

There is also a version contract to keep. Because apps compile the source, a library update can surface a type error in the app's build that a prebuilt bundle would have hidden. That is arguably a feature, but it does mean releases need a typecheck before they ship.

For a library whose only consumers are Nuxt apps, the trade is easy to accept. The point is not that build steps are bad. It is that a build step is code too, and the cheapest code to maintain is the code you don't need.