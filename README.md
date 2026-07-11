<div align="center">

# 🎨 UI Vintage

### A source-published Nuxt UI runtime for focused, reusable interfaces

`@brumaombra/ui-vintage` is a Nuxt 4 component library and runtime module for building consistent dashboards, forms, landing pages, overlays, and content experiences. It combines reusable Vue components, shared theme tokens, localization, and Nuxt integrations in one package that is compiled by the consuming application.

<p>
    <a href="https://github.com/brumaombra/ui-vintage"><img alt="GitHub Repo" src="https://img.shields.io/badge/github-brumaombra%2Fui--vintage-111111?logo=github"></a>
    <img alt="Nuxt 4" src="https://img.shields.io/badge/nuxt-4-00DC82?logo=nuxt&logoColor=white">
    <img alt="Vue 3" src="https://img.shields.io/badge/vue-3-42B883?logo=vue.js&logoColor=white">
    <img alt="npm" src="https://img.shields.io/npm/v/@brumaombra/ui-vintage?color=CB3837&logo=npm">
    <img alt="License MIT" src="https://img.shields.io/badge/license-MIT-2563EB">
</p>

<p>
    🧩 Reusable Vue components • 🎨 Shared theme tokens • 🌍 Built-in locale messages • 🖼️ Nuxt Image integration • ⚡ Source-based publishing
</p>

<p>
    <a href="#overview"><strong>Overview</strong></a> •
    <a href="#images"><strong>Images</strong></a> •
    <a href="#features"><strong>Features</strong></a> •
    <a href="#architecture"><strong>Architecture</strong></a> •
    <a href="#quick-start"><strong>Quick Start</strong></a> •
    <a href="#usage"><strong>Usage</strong></a> •
    <a href="#components"><strong>Components</strong></a> •
    <a href="#demo-app"><strong>Demo App</strong></a> •
    <a href="#configuration"><strong>Configuration</strong></a> •
    <a href="#publishing"><strong>Publishing</strong></a> •
    <a href="#troubleshooting"><strong>Troubleshooting</strong></a> •
    <a href="#license"><strong>License</strong></a>
</p>

</div>

<a id="overview"></a>
## 📘 Overview

UI Vintage is designed for Nuxt applications that need a coherent interface without rebuilding the same primitives for every project. The package provides low-level controls such as buttons, inputs, selects, dialogs, tabs, switches, and sidebars alongside higher-level building blocks such as dashboard shells, landing layouts, cards, data lists, and message flows.

The package is intentionally published as source. The consuming Nuxt application compiles the library together with its own runtime, which keeps Nuxt-specific integrations available and avoids maintaining a separate framework-agnostic build artifact.

This is a Nuxt library, not a generic Vue component bundle. Components rely on Nuxt runtime features including `#components`, `NuxtImg`, and module lifecycle hooks.

<a id="images"></a>
## 🖼️ Images

### Screenshots

<div align="center">
    <table width="100%" style="max-width: 768px;">
        <tr>
            <td align="center" valign="top">
                <img src="https://raw.githubusercontent.com/brumaombra/ui-vintage/main/docs/images/screen-1.png" alt="UI Vintage component demo controls and primary actions" width="100%">
            </td>
            <td align="center" valign="top">
                <img src="https://raw.githubusercontent.com/brumaombra/ui-vintage/main/docs/images/screen-2.png" alt="UI Vintage select, accordion, tabs, and component previews" width="100%">
            </td>
        </tr>
        <tr>
            <td align="center" valign="top">
                <img src="https://raw.githubusercontent.com/brumaombra/ui-vintage/main/docs/images/screen-3.png" alt="UI Vintage surface variants, badges, dialogs, and feedback previews" width="100%">
            </td>
            <td align="center" valign="top">
                <img src="https://raw.githubusercontent.com/brumaombra/ui-vintage/main/docs/images/screen-4.png" alt="UI Vintage loading, toast, and current state previews" width="100%">
            </td>
        </tr>
    </table>
    <p>
        <img src="https://raw.githubusercontent.com/brumaombra/ui-vintage/main/docs/images/blog.png" alt="UI Vintage landing and blog showcase" width="100%" style="max-width: 768px;">
    </p>
    <p>
        <sub>Component showcase, interactive states, landing surface, and full-width blog showcase</sub>
    </p>
</div>

<a id="features"></a>
## ✨ Features

- Nuxt 4 module with automatic runtime integration.
- Shared stylesheet and design tokens injected from `src/styles.css`.
- Explicit subpath imports that keep application dependencies clear.
- Vue 3 components built with Composition API and TypeScript source.
- Primitive UI controls based on Reka UI where accessible behavior is required.
- Reusable dashboard, landing, blog, card, field, and data-display components.
- Built-in busy, confirm-dialog, message-dialog, and message-toast flows.
- Theme selector with light, dark, and automatic system modes.
- Library locale messages merged into an existing Vue I18n instance when available.
- Automatic `@nuxt/image` installation for components that use `NuxtImg`.
- Source publishing with no required library build step before installation.

<a id="architecture"></a>
## 🏗️ Architecture

UI Vintage is split into three cooperating layers:

- 🧩 **Components** in `src/components/` contain the public Vue UI and composite layouts.
- 🎨 **Styles and helpers** in `src/styles.css` and `src/lib/` provide theme tokens, class utilities, and shared behavior.
- 🔌 **Nuxt runtime** in `module.mjs` and `src/runtime/` integrates the package with the consuming app.

### 🔄 Module Behavior

When the module is registered, it:

1. Injects `src/styles.css` into the Nuxt application once.
2. Adds the published `src/` directory to Nuxt transpilation.
3. Installs `@nuxt/image` when the consuming app has not already registered it.
4. Registers the library i18n plugin.
5. Merges the library’s locale messages into the app’s Vue I18n composer when Vue I18n is present.

The module does not auto-register every component. Import components and helpers explicitly from their public subpaths.

### 📁 Repository Layout

```text
src/
  components/       # Public components and UI primitives
  i18n/              # Library locale messages
  lib/               # Shared helpers and token utilities
  runtime/           # Nuxt runtime plugins
  styles.css         # Shared design tokens and component styles
module.mjs          # Nuxt module entrypoint
demo-app/            # Private Nuxt showcase and manual verification app
```

<a id="quick-start"></a>
## 🚀 Quick Start

### 📦 Install the package

Install the UI Vintage library and the peer integrations used by the package in an existing Nuxt 4 application:

```bash
npm install @brumaombra/ui-vintage @nuxt/image vue-i18n
```

### 🔌 Register the module

Add the module to `nuxt.config.js`:

```js
export default defineNuxtConfig({
    modules: [
        '@brumaombra/ui-vintage'
    ]
});
```

`@nuxt/image` is installed by the module when it is not already present in the app’s module list. Install it explicitly when your application also uses image components directly. Vue I18n is optional at runtime, but it is required for the library’s locale messages and translated components.

<a id="usage"></a>
## 🧪 Usage

### 🧱 Use a component

Components are imported from explicit package subpaths:

```vue
<script setup>
import { Button } from '@brumaombra/ui-vintage/button';
import { Card, CardContent } from '@brumaombra/ui-vintage/card';
</script>

<template>
    <Card>
        <CardContent class="flex items-center justify-between gap-4">
            <span>Workspace status</span>

            <!-- For example, the Button component accepts variants such as primary, secondary, gray, and ghost -->
            <Button variant="primary">Save changes</Button>
        </CardContent>
    </Card>
</template>
```

### 🔔 Use a message flow

The dialog and busy helpers can be imported directly from their subpaths:

```js
import { showConfirmDialog } from '@brumaombra/ui-vintage/confirm-dialog';
import { setBusy } from '@brumaombra/ui-vintage/busy-indicator';

// Ask for confirmation before starting a destructive action
const confirmed = await showConfirmDialog({
    title: 'Delete project?',
    message: 'This action cannot be undone.'
});

if (confirmed) {
    // Keep the shared loading state visible while the request is running
    setBusy({
        title: 'Deleting project',
        description: 'Please wait while the project is removed.'
    });
}
```

### 🧭 Use a layout component

Higher-level components accept slots so application navigation and content remain app-owned. The shell provides the layout; the application provides its navigation data:

```vue
<script setup>
import { DashboardShell } from '@brumaombra/ui-vintage/dashboard-shell';

// List of sections
const sidebarSections = [{
    id: 'workspace',
    label: 'Workspace',
    items: [
        { id: 'overview', label: 'Overview', href: '/', active: true },
        { id: 'settings', label: 'Settings', href: '/settings' }
    ]
}];
</script>

<template>
    <DashboardShell :sidebar-sections="sidebarSections">
        <slot />
    </DashboardShell>
</template>
```

<a id="components"></a>
## 🧩 Components

The package exposes components through explicit subpaths. The complete public export map is maintained in `package.json`; common groups include:

### 🎛️ UI primitives

`alert`, `alert-dialog`, `accordion`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `command`, `dialog`, `field`, `input`, `label`, `popover`, `progress`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `switch`, `table`, `tabs`, `textarea`, `time-picker`, and `tooltip`.

### 🧱 Composite components

`background-grid`, `card-grid`, `chip`, `dashboard-shell`, `data-list`, `empty-state-card`, `error-page`, `info-card`, `landing`, `landing-content`, `landing-footer`, `landing-navbar`, `landing-shell`, `load-more-button`, `loading-state-card`, `page-header`, `progress-component`, `single-value-card`, `text-link`, and `theme-selector`.

### 💬 Runtime flows and integrations

`busy`, `busy-indicator`, `confirm-dialog`, `message-dialog`, `message-toast`, `language-flag`, `language-selector`, `blog`, `content`, and `utils`.

<a id="demo-app"></a>
## 🖥️ Demo App

The private `demo-app/` directory is a Nuxt 4 showcase for manual verification. It demonstrates the public components, shared theme behavior, responsive layouts, form states, dialogs, toasts, tabs, accordions, localization, and dashboard composition.

The demo app is not part of the published package and is not intended to be installed by consumers. It imports the package through `file:..`, so it exercises the same source that is published to npm.

### ▶️ Run the showcase locally

From the repository root:

```bash
# Install dependencies for the demo app
npm --prefix demo-app install

# Start the Nuxt development server
npm --prefix demo-app run dev
```

Open the local URL printed by Nuxt. To create a production build of the showcase:

```bash
# Build the private verification app
npm --prefix demo-app run build
```

<a id="configuration"></a>
## ⚙️ Configuration

### 🎨 Styles

The module injects the shared stylesheet automatically. The stylesheet is also available as an explicit export when an app needs to control loading order:

```js
// Import the shared tokens and component styles explicitly when needed
import '@brumaombra/ui-vintage/style.css';
```

Avoid creating a second theme-token system in the consuming app. Extend the existing CSS custom properties in your application stylesheet when a project needs additional brand values.

### 🌍 Localization

The package includes English, Italian, French, Spanish, German, Portuguese, Chinese, Japanese, and Russian library messages. When `@nuxtjs/i18n` or Vue I18n is configured, the runtime plugin merges these messages into the existing composer without replacing application messages.

Application-specific translations remain owned by the consuming app. The library only contributes messages under its own `uiVintage` namespace.

### 🧭 Imports

Use explicit subpaths for public imports:

```js
// Import a component from its stable public entrypoint
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@brumaombra/ui-vintage/tabs';

// Import shared helper behavior from its dedicated entrypoint
import { showMessageToast } from '@brumaombra/ui-vintage/message-toast';
```

Do not import internal files from `src/components/` in application code. Internal paths are implementation details and may change independently of public entrypoints.

<a id="publishing"></a>
## 📦 Publishing Model

UI Vintage publishes the Nuxt module entrypoint and source files directly:

- `module.mjs` is the package entrypoint registered by Nuxt.
- `src/` contains the published components, styles, helpers, locale messages, and runtime plugin.
- `package.json` defines the public component subpath exports.
- `dist/` is generated repository output and is not the source of truth for consumers.

There is no required library build step before publishing. The normal verification command is:

```bash
# Check the published TypeScript and Vue source without generating dist output
npm run typecheck
```

For release details, see [NPM.md](NPM.md). The package is published under the public npm scope `@brumaombra/ui-vintage`.

<a id="requirements"></a>
## 🧰 Requirements

- Node.js compatible with the Nuxt 4 version used by the consuming app.
- Nuxt 4.
- Vue 3.5 or newer.
- `@nuxt/image` for image-enabled components. The module installs it when needed.
- `vue-i18n` when using the library’s localization integration.

<a id="troubleshooting"></a>
## 🛠️ Troubleshooting

- **Components cannot resolve Nuxt imports:** confirm the app is Nuxt 4 and that `@brumaombra/ui-vintage` is registered in `nuxt.config.js`.
- **Styles are missing:** check that the module is registered once and restart the Nuxt dev server after changing `nuxt.config.js`.
- **`NuxtImg` is unavailable:** install `@nuxt/image` or allow the UI Vintage module to install it during Nuxt setup.
- **Translations do not appear:** configure Vue I18n or `@nuxtjs/i18n`; the runtime plugin merges messages only when an i18n composer is available.
- **A component import fails:** use the public subpath listed in `package.json`, such as `@brumaombra/ui-vintage/button`, rather than an internal `src/` path.
- **The demo app does not start:** run `npm --prefix demo-app install` from the repository root, then retry `npm --prefix demo-app run dev`.

<a id="license"></a>
## 📄 License

This project is released under the MIT License. See [LICENSE](LICENSE) for the full license text.