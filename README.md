# theme-vintage

A reusable Nuxt component library scaffold aligned with the Bitcoin Ticker web UI.

## What This Is

- A publishable package for shared UI components.
- A single root barrel file at `src/index.ts`.
- The same base CSS tokens and Tailwind setup used by Bitcoin Ticker.
- A folder layout that stays compatible with `shadcn-vue` additions.

## Development

```bash
npm install
npm run build
```

## Usage

```ts
import { Busy } from "theme-vintage"
```

If you prefer explicit CSS loading, you can also import:

```ts
import "theme-vintage/style.css"
```

## Adding Components

- Keep shared components under `src/components/`.
- Export every public component from `src/index.ts`.
- Keep `src/lib/utils.ts` as the shared utility entry used by shadcn components.
- Use `components.json` with `shadcn-vue` to scaffold new primitives into this package.

Example:

```bash
npx shadcn-vue@latest add button
```