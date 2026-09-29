# Copilot Instructions

## Project Scope

ui-vintage is a source-published Nuxt 4 component library. The published package name is `@brumaombra/ui-vintage`.

- `src/` contains the published library source (components, styles, helpers, locale messages, runtime plugin).
- `module.mjs` is the Nuxt module entrypoint that injects `src/styles.css`, transpiles `src/`, installs `@nuxt/image`, and registers the i18n plugin.
- `demo-app/` is a private Nuxt 4 showcase used for manual verification. It consumes the package through `file:..`.
- There is no build step and no `dist/` output: consuming apps compile the source.

See [README.md](../README.md) for package usage.

## Verify

- Install root dependencies with `npm install`.
- Type-check the library with `npm run typecheck` (vue-tsc).
- Run the demo from the repo root with `npm --prefix demo-app install` and `npm --prefix demo-app run dev`.

## Architecture

- The package exposes explicit subpath entrypoints instead of a root barrel (for example `@brumaombra/ui-vintage/button`). Every entrypoint is listed in the `exports` map of `package.json`.
- `src/components/ui/` holds shadcn-vue style primitives built on Reka UI. Other directories under `src/components/` hold higher-level components and runtime flows (toasts, dialogs, busy overlay).
- Inside the library, import other components with relative paths, never through `@brumaombra/ui-vintage/...`.

## Conventions

- For every new public component, add an `index.ts` in its directory and expose it through `package.json` exports.
- After changing a public API or adding an entry point, add its description to `scripts/components-meta.mjs` and run `npm run docs:components` to regenerate `COMPONENTS.md` (the publish workflow fails when it is stale).
- Use the semantic Tailwind tokens (`bg-card`, `bg-surface`, `bg-accent`, `text-muted-foreground`, `border-border`, `border-border-strong`, `bg-primary`, `hover:bg-primary-hover`, ...). They switch automatically in dark mode, so avoid paired `light`/`dark:` color classes.
- Use the motion utilities from `src/styles.css` (`ease-spring`, `uv-floating-motion`, `uv-modal-motion`, `uv-field`, `animate-uv-pop`, ...) instead of ad-hoc animations. In custom transitions, list `scale`, `rotate`, and `translate` by name; Tailwind v4 does not animate them through `transform`.
- User-facing default strings go through vue-i18n under the `uiVintage` namespace, with keys added to all nine files in `src/i18n/`.
- Keep shared design tokens in `src/styles.css`; extend the existing token structure instead of creating parallel theme systems.
- Preserve the shadcn-vue folder layout and aliases defined in `components.json`.
- New demo examples belong in `demo-app/app/pages/` using `DemoSection`, and new sections must be registered in `demo-app/app/utils/demo-navigation.ts` so they appear in the sidebar and command palette.