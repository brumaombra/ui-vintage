# Installable app (PWA)


Turn an app into an installable PWA with an offline page, with no extra dependencies. The option is off by default:

```ts
export default defineNuxtConfig({
	uiVintage: {
		pwa: {
			name: 'Acme', // Shown on the offline page
			logo: '/logo.svg', // Optional, with `logoDark` for the dark theme
			font: { family: 'Inter', regular: '/fonts/inter.woff2', bold: '/fonts/inter-bold.woff2' }, // Optional, saved for the offline page
			precache: ['/icons/icon-192.png'] // Optional, other files to keep on the device
		}
	}
});
```

The module then writes a service worker (`/sw.js`) and an offline page (`/offline.html`) as static files of each build, so they work for server and static apps alike, and registers the worker in production builds (never in development). The worker:

- loads pages from the network, and shows the offline page (in the language of the page, light or dark like the app) when there is no connection, reloading by itself once it's back;
- keeps the built files (`/_nuxt/`, whose names change with every build) on the device, so the app opens faster;
- leaves everything else alone: the API, live updates, other methods and other origins always go to the network, so data is never stale.

The same option makes the app feel native once installed (or published on the Play Store as a Trusted Web Activity):

```ts
pwa: {
	name: 'Acme',
	// The manifest, one per language (any text can be { en, it, ... }), linked in the language of the page
	manifest: {
		id: '/', // Never change it once people installed the app
		description: { en: 'Notes for teams', it: 'Note per i team' },
		startUrl: { en: '/home', it: '/it/home' },
		themeColor: '#fafafa',
		backgroundColor: '#fafafa',
		icons: [{ src: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
		shortcuts: [{ name: { en: 'New note', it: 'Nuova nota' }, url: { en: '/new', it: '/it/new' }, icon: '/shortcuts/new.png', iconPurpose: 'maskable' }], // 96x96 PNG (maskable: fills the square, Android crops it)
		screenshots: [{ src: { en: '/store/en/home.png', it: '/store/it/home.png' }, sizes: '1080x1920', formFactor: 'narrow', label: { en: 'Home', it: 'Home' } }] // One image for every language, or one per language
	},
	// The Android app (Trusted Web Activity): writes /.well-known/assetlinks.json, so it opens without the browser bar
	android: { packageName: 'com.acme.app', sha256CertFingerprints: ['AB:CD:...'] }
}
```

- **Back button** (every app): on touch screens, the back button of the phone (or the back swipe) closes the open dialog or sheet instead of leaving the page.
- **Edge to edge** (with `pwa`): the viewport covers the whole screen (`viewport-fit=cover`), and the library components keep clear of the notch and the gesture bar with the safe areas. Set `edgeToEdge: false` if the app's own fixed elements don't use them yet.
- **Touch details** (every app): a long press doesn't select the labels of controls or open the link menu on them, and the installed app doesn't bounce at the edges of the page.

- **Push notifications** (with `pwa: { push: true }`, or `push: { icon, badge }`): the service worker shows the pushes the server sends, as JSON `{ title, body, url, tag }` (a tag replaces the earlier notification with the same tag), with the icon of the app (`logo` by default; use a PNG, Android doesn't show SVG icons) and an optional monochrome `badge` for the Android status bar. Tapping one opens its `url` in the open window of the app, or in a new one, and only pages of the app. Subscribing the browser and sending the pushes (VAPID) stay in the app.

Every build gets its own cache, and the old ones are deleted when the new worker takes over. The manifest stays in the app (`public/manifest.webmanifest`). To remove the worker from every device, set `pwa: { name: 'Acme', selfDestroy: true }` and deploy: it deletes its caches and unregisters itself.