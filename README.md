# UI Vintage

`@brumaombra/ui-vintage` is a source-published Nuxt runtime package. Instead of building a separate component library output, it ships the actual `src` files and lets the consuming Nuxt app compile them as part of its own runtime.

## Features

- Nuxt module entrypoint for stylesheet, i18n, and Nuxt runtime integration
- automatic stylesheet injection from `src/styles.css`
- explicit source-based subpath imports for components and helpers
- built-in locale merge for the library messages when `vue-i18n` is present
- real Nuxt integrations, including `@nuxt/image` components inside the shared source

## Nuxt Only

This package is intentionally Nuxt-specific. The shared components use Nuxt runtime features such as `#components`, `NuxtImg`, and module-driven app integration. If you need framework-agnostic Vue components, this package is the wrong shape.

## Install

```bash
npm install @brumaombra/ui-vintage @nuxt/image vue-i18n
```

Register the module in your Nuxt app:

```ts
export default defineNuxtConfig({
    modules: ['@brumaombra/ui-vintage']
})
```

The module only handles shared runtime integration: styles, library locale messages, source transpilation, and `@nuxt/image` installation when needed. Components and helpers are always imported explicitly.

## Usage

Once the module is installed:

- the shared stylesheet is injected automatically
- components are imported from explicit subpaths such as `@brumaombra/ui-vintage/button`
- helpers are imported from explicit subpaths such as `@brumaombra/ui-vintage/message-dialog`

Example:

```vue
<script setup lang="ts">
import { Button } from '@brumaombra/ui-vintage/button'
import { Card, CardContent } from '@brumaombra/ui-vintage/card'
</script>

<template>
    <Button>Save</Button>
    <Card>
        <CardContent>Reusable content</CardContent>
    </Card>
</template>
```

```ts
import { setBusy } from '@brumaombra/ui-vintage/busy-indicator'
import { showConfirmDialog } from '@brumaombra/ui-vintage/confirm-dialog'

await showConfirmDialog({
    title: 'Delete item?',
    description: 'This action cannot be undone.'
})

setBusy({
    title: 'Loading data',
    description: 'Please wait while the dashboard refreshes.'
})
```

## Publish Model

The npm package publishes `module.mjs` and `src/` directly. There is no required `dist` build step for publishing anymore.

## Requirements

- Nuxt 4
- `@nuxt/image`
- Vue 3
- `vue-i18n`

## License

MIT