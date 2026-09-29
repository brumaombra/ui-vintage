---
name: ui-vintage
description: Build Nuxt UI with the @brumaombra/ui-vintage component library. Use whenever creating or changing pages, layouts, forms, tables, dialogs, toasts, or any other UI in an app that depends on @brumaombra/ui-vintage, before writing custom components or styles.
---

# UI Vintage

This app uses `@brumaombra/ui-vintage`, a Nuxt component library with its own design tokens, motion system, and runtime flows. Reuse it instead of building UI from scratch.

## 1. Read the catalog first

The complete, version-matched API reference is installed with the package:

`node_modules/@brumaombra/ui-vintage/COMPONENTS.md`

Search it (for example for `### \`@brumaombra/ui-vintage/`, a component name, or a prop) instead of reading it top to bottom. It lists every entry point with its import line, components, props and defaults, events, slots, helpers, and usage examples. Never guess prop names: check them there.

## 2. Choose the component

- Before writing a custom component, check the catalog's Contents list. Common mappings:
  - Searchable select → `combobox` (`ComboboxSelect`); plain select → `select`.
  - Table with sorting or selection → `data-table`; KPI tiles → `single-value-card`.
  - Confirmation → `showConfirmDialog` (`confirm-dialog`); notification → `showMessageToast` (`message-toast`); blocking load → `setBusy` (`busy-indicator`). These mount themselves, so do not add them to the template.
  - App layout with sidebar → `dashboard-shell`; marketing or blog layout → `landing`.
  - Empty and loading placeholders → `empty-state-card`, `loading-state-card`, `skeleton`.
- Only build something new when no entry point fits, and compose it from library primitives (`card`, `button`, `field`, ...).

## 3. Follow the library conventions

- Import from explicit subpaths: `import { Button } from '@brumaombra/ui-vintage/button'`. Never import from `@brumaombra/ui-vintage/src/...`.
- Style with the semantic tokens (`bg-card`, `bg-surface`, `bg-accent`, `bg-primary`, `text-muted-foreground`, `border-border`, `border-border-strong`, ...). They adapt to dark mode, so do not write `dark:` color variants or hard-coded colors for surfaces and text.
- Customize components through their props and the `class` prop (merged with tailwind-merge) rather than wrapping them in extra styled elements.
- For motion, reuse the library utilities (`ease-spring`, `ease-out-expo`, `animate-uv-fade-up`, `animate-uv-pop`, `uv-floating-motion`, `shadow-elevated-*`). In custom transitions, name `scale`, `rotate`, and `translate` explicitly; Tailwind v4 does not animate them through `transform`.
- Icons are Hugeicons definitions: import from `@hugeicons/core-free-icons` and pass them to `:icon` props, or render them with `HugeiconsIcon` from `@hugeicons/vue`.
- Form controls use `v-model`. Mark invalid fields with `aria-invalid` and show messages with `FieldError`.
- Library strings are translated through vue-i18n (`uiVintage.*` keys). App copy belongs in the app's own locale files.

## 4. Check your work

- Every import path you used appears as an entry point in `COMPONENTS.md`.
- Every prop and event you used appears in that component's table.
- No new CSS reimplements something a component or token already provides.