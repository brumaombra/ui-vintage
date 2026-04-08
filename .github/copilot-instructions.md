# Copilot Instructions

## Project Scope

ui-vintage is a publishable Vue 3 component library built with Vite and TypeScript. The published package name is `@brumaombra/ui-vintage`.

- `src/` contains the library source that is published.
- `demo-app/` is a private Nuxt 4 showcase used for manual verification and local demos.
- `dist/` is generated build output and should not be edited manually.

See [README.md](../README.md) for package usage and shadcn-vue scaffolding notes.

## Build And Verify

- Install root dependencies with `npm install`.
- Build the library with `npm run build`.
- Type-check the library with `npm run typecheck`.
- Run demo app commands from the repo root with `npm --prefix demo-app install`, `npm --prefix demo-app run dev`, `npm --prefix demo-app run build`, and `npm --prefix demo-app run preview`.
- Prefer `package.json` scripts over README command snippets when they differ.

## Architecture

- `src/index.ts` is the public barrel for the package and is responsible for top-level exports and the global stylesheet import.
- `vite.config.ts` dynamically creates library entry points from component directories that contain `index.ts` files under `src/components/` and `src/components/ui/`, plus `src/lib/utils.ts`.
- `src/components/ui/` holds reusable shadcn-style primitives. Other directories under `src/components/` hold higher-level library components.
- `demo-app/nuxt.config.ts` aliases `@brumaombra/ui-vintage` and `@brumaombra/ui-vintage/style.css` to local source files, so demo verification should target source behavior rather than built `dist` files.

## Conventions

- For every new public component, add an `index.ts` in its directory and export it from `src/index.ts`.
- Keep shared design tokens and Tailwind-driven theme variables in `src/styles.css`; extend the existing token structure instead of creating parallel theme systems.
- Preserve the shadcn-vue folder layout and aliases defined in `components.json`.
- Keep package publishing metadata consistent with the build output in `package.json`, especially `files`, `exports`, `main`, and `types`.
- Make focused changes and avoid editing generated files in `dist/` unless the task is explicitly about inspecting publish output.