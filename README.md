<div align="center">

# 🎛️ UI Vintage

### Reusable Nuxt UI components with dedicated imports, shared theme tokens, and built-in Nuxt integrations.

`@brumaombra/ui-vintage` is a Nuxt-first component library built with Vite and TypeScript.

<p>
	<a href="https://github.com/brumaombra/ui-vintage"><img alt="GitHub Repo" src="https://img.shields.io/badge/github-brumaombra%2Fui--vintage-111111?logo=github"></a>
	<a href="https://www.npmjs.com/package/%40brumaombra%2Fui-vintage"><img alt="npm" src="https://img.shields.io/npm/v/%40brumaombra%2Fui-vintage?logo=npm&color=CB3837"></a>
	<img alt="Nuxt 4" src="https://img.shields.io/badge/nuxt-4-00DC82?logo=nuxt&logoColor=white">
	<img alt="License MIT" src="https://img.shields.io/badge/license-MIT-2563EB">
</p>

<p>
	🧩 UI primitives • 🎭 dialogs and overlays • 🧱 dashboard helpers • 🎨 shared styles
</p>

<p>
	<a href="#features"><strong>Features</strong></a> •
	<a href="#install"><strong>Install</strong></a> •
	<a href="#usage"><strong>Usage</strong></a> •
	<a href="#license"><strong>License</strong></a>
</p>

</div>

<a id="features"></a>
## ✨ Features

- Nuxt-first components for common app interfaces
- dedicated subpath imports such as `@brumaombra/ui-vintage/button`
- shared stylesheet at `@brumaombra/ui-vintage/style.css`
- higher-level helpers like `DashboardShell`, `showConfirmDialog`, `showMessageDialog`, and `setBusy`
- built-in use of Nuxt primitives such as `NuxtImg` and Nuxt component resolution

## Nuxt Only

`@brumaombra/ui-vintage` is intentionally a Nuxt library, not a generic Vue component library.

The package assumes a Nuxt app environment and uses Nuxt-specific features in shared components, including:

- `NuxtImg` from `@nuxt/image`
- Nuxt component resolution via `#components`
- Nuxt-friendly app-level integration patterns used by the shipped demo app

If you need framework-agnostic Vue components, this package is the wrong abstraction layer.

<a id="install"></a>
## 📦 Install

```bash
npm install @brumaombra/ui-vintage @nuxt/image
```

Enable the Nuxt image module in your app:

```ts
export default defineNuxtConfig({
	modules: [
		'@nuxt/image'
	]
})
```

<a id="usage"></a>
## 🚀 Usage

Import the shared stylesheet once in your Nuxt app:

```ts
import "@brumaombra/ui-vintage/style.css";
```

Then import components from their dedicated entrypoints inside your Nuxt app code:

```vue
<script setup lang="ts">
import { Button } from "@brumaombra/ui-vintage/button";
import { Card, CardContent, CardHeader, CardTitle } from "@brumaombra/ui-vintage/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@brumaombra/ui-vintage/dialog";
</script>
```

Higher-level Nuxt-oriented pieces are available from their own paths:

```ts
import { DashboardShell } from "@brumaombra/ui-vintage/dashboard-shell";
import { setBusy } from "@brumaombra/ui-vintage/busy-indicator";
import { showConfirmDialog } from "@brumaombra/ui-vintage/confirm-dialog";
import { showMessageDialog } from "@brumaombra/ui-vintage/message-dialog";
```

There is no global barrel export. Use the dedicated subpath entrypoints for each component or helper.

## Requirements

- Nuxt 4
- `@nuxt/image`
- Vue 3 and `vue-i18n` versions compatible with your Nuxt app

The package is distributed as a library, but it expects the consuming runtime to be Nuxt.

<a id="license"></a>
## ⚖️ License

MIT