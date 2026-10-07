# UI Vintage: instructions for AI agents

These instructions are for agents that build UI in an app that depends on `@brumaombra/ui-vintage`, a Nuxt 4 component library with its own design tokens, motion system, and runtime flows. Reuse the library instead of building UI from scratch.

## 1. Read the catalog first

The complete API reference matching the installed version ships with the package:

`node_modules/@brumaombra/ui-vintage/COMPONENTS.md`

Search it (for example for `` ### `@brumaombra/ui-vintage/ ``, a component name, or a prop) instead of reading it top to bottom. It lists every entry point with its import line, components, props and defaults, events, slots, helpers, and examples. Never guess prop names: check them there.

## 2. Choose the component

Before writing a custom component, check the catalog's contents list. Common mappings:

- Searchable select → `combobox` (`ComboboxSelect`); plain select → `select`.
- Table with sorting or selection → `data-table`; KPI tiles → `single-value-card`; a compact row of numbers → `stat-strip`.
- Confirmation → `showConfirmDialog` (`confirm-dialog`); notification → `showMessageToast` (`message-toast`); blocking load → `setBusy` (`busy-indicator`). These mount themselves, so don't add them to a template.
- App layout with a sidebar → `dashboard-shell`; marketing or blog layout → `landing`; page title row → `page-header`.
- Empty and loading placeholders → `empty-state-card`, `loading-state-card`, `skeleton`.
- Blog pages with Nuxt Content → `blog` (`BlogHeaderSection`, `BlogPostHeader`, `PostsList`, `TableOfContents`, `BlogContentRenderer`, ...).

Only build something new when no entry point fits, and compose it from library primitives (`card`, `button`, `field`, ...).

## 3. Follow the library conventions

- Import from explicit subpaths: `import { Button } from '@brumaombra/ui-vintage/button'`. Never import from `@brumaombra/ui-vintage/src/...`.
- Style with the semantic tokens (`bg-background`, `bg-card`, `bg-surface`, `bg-accent`, `bg-primary`, `text-foreground`, `text-muted-foreground`, `border-border`, `border-border-strong`, ...). They adapt to dark mode, so don't write `dark:` color variants or hard-coded colors for surfaces and text.
- Customize components through their props and the `class` prop (merged with tailwind-merge) rather than wrapping them in extra styled elements.
- Keep corners at `rounded` (the library's square look) and use `shadow-elevated-sm|md|lg|xl` for elevation, without glows or gradients.
- For motion, reuse the library utilities (`ease-spring`, `ease-out-expo`, `animate-uv-fade-up`, `animate-uv-pop`, `uv-floating-motion`). In custom transitions, name `scale`, `rotate`, and `translate` explicitly; Tailwind v4 doesn't animate them through `transform`.
- Icons are Hugeicons definitions: import them from `@hugeicons/core-free-icons` and pass them to `:icon` props, or render them with `HugeiconsIcon` from `@hugeicons/vue`.
- Form controls use `v-model`. Mark invalid fields with `aria-invalid` and show messages with `FieldError`.
- Library strings are translated through vue-i18n (`uiVintage.*` keys). App copy belongs in the app's own locale files.

## 4. Check your work

- Every import path you used appears as an entry point in `COMPONENTS.md`.
- Every prop and event you used appears in that component's table.
- No new CSS reimplements something a component or token already provides.
