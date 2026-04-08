<div align="center">

# 🎛️ UI Vintage

### Reusable Vue 3 UI components with dedicated imports and shared theme tokens.

`@brumaombra/ui-vintage` is a Vue 3 component library built with Vite and TypeScript.

<p>
	<a href="https://github.com/brumaombra/ui-vintage"><img alt="GitHub Repo" src="https://img.shields.io/badge/github-brumaombra%2Fui--vintage-111111?logo=github"></a>
	<a href="https://www.npmjs.com/package/%40brumaombra%2Fui-vintage"><img alt="npm" src="https://img.shields.io/npm/v/%40brumaombra%2Fui-vintage?logo=npm&color=CB3837"></a>
	<img alt="Vue 3.5" src="https://img.shields.io/badge/vue-3.5-42B883?logo=vue.js&logoColor=white">
	<img alt="License MIT" src="https://img.shields.io/badge/license-MIT-2563EB">
</p>

<p>
	🧩 UI primitives • 🪟 dialogs and overlays • 🧱 dashboard helpers • 🎨 shared styles
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

- Vue 3 components for common app interfaces
- dedicated subpath imports such as `@brumaombra/ui-vintage/button`
- shared stylesheet at `@brumaombra/ui-vintage/style.css`
- higher-level helpers like `DashboardShell`, `showConfirmDialog`, `showMessageDialog`, and `setBusy`

<a id="install"></a>
## 📦 Install

```bash
npm install @brumaombra/ui-vintage
```

<a id="usage"></a>
## 🚀 Usage

Import the shared stylesheet once in your app:

```ts
import "@brumaombra/ui-vintage/style.css"
```

Import each component from its dedicated entrypoint:

```ts
import { Button } from "@brumaombra/ui-vintage/button"
import { Card, CardContent, CardHeader, CardTitle } from "@brumaombra/ui-vintage/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@brumaombra/ui-vintage/dialog"
```

Import helpers and higher-level components from their own paths:

```ts
import { DashboardShell } from "@brumaombra/ui-vintage/dashboard-shell"
import { setBusy } from "@brumaombra/ui-vintage/busy-indicator"
import { showConfirmDialog } from "@brumaombra/ui-vintage/confirm-dialog"
import { showMessageDialog } from "@brumaombra/ui-vintage/message-dialog"
```

There is no global barrel export. Use the dedicated subpath entrypoints for each component or helper.

<a id="license"></a>
## ⚖️ License

MIT