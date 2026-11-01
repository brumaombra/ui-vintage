import { describe, expect, it, vi } from 'vitest';
import { buildAssetLinks, buildManifests, buildOfflinePage, buildServiceWorker } from '../../../src/runtime/pwa/builders.mjs';

// Options of a service worker for build "b2"
const OPTIONS = { version: 'b2', precache: ['/offline.html', '/fonts/mono.woff2'], buildAssetsDir: '/_nuxt/', offlinePath: '/offline.html' };
const ORIGIN = 'https://app.example';

// Run a generated service worker against a fake browser: its caches, the network and the events it listens to
const runServiceWorker = ({ code, cachedNames = [], network = async () => new Response('from the network') }) => {
	// Caches: name -> (path -> response)
	const stores = new Map(cachedNames.map(name => [name, new Map()]));
	const addedRequests = [];
	const keyOf = request => new URL(typeof request === 'string' ? request : request.url, ORIGIN).pathname;
	const openCache = name => {
		if (!stores.has(name)) stores.set(name, new Map());
		const store = stores.get(name);
		return {
			match: async request => store.get(keyOf(request))?.clone(),
			put: async (request, response) => { store.set(keyOf(request), response); },
			addAll: async requests => { for (const request of requests) { addedRequests.push(request); store.set(keyOf(request), new Response(`saved ${keyOf(request)}`)); } }
		};
	};
	const caches = {
		open: async name => openCache(name),
		keys: async () => [...stores.keys()],
		delete: async name => stores.delete(name),
		match: async request => { for (const name of stores.keys()) { const hit = await openCache(name).match(request); if (hit) return hit; } return undefined; }
	};

	// The global scope of the service worker
	const listeners = {};
	const self = {
		location: new URL(ORIGIN),
		addEventListener: (type, listener) => { listeners[type] = listener; },
		skipWaiting: vi.fn(),
		clients: { claim: vi.fn(), matchAll: vi.fn(async () => [{ url: `${ORIGIN}/markets`, navigate: vi.fn() }]) },
		registration: { unregister: vi.fn() }
	};
	const fetch = vi.fn(network);
	const Request = class { constructor(url, init = {}) { this.url = url; this.cache = init.cache || 'default'; } };
	new Function('self', 'caches', 'fetch', 'Request', code)(self, caches, fetch, Request);

	// Fire an event and wait for the work it hands over
	const fire = async (type, extra = {}) => {
		let pending = Promise.resolve();
		let response;
		const event = { ...extra, waitUntil: promise => { pending = promise; }, respondWith: promise => { response = promise; } };
		listeners[type](event);
		await pending;
		return response === undefined ? undefined : await response;
	};
	const request = (path, { method = 'GET', mode = 'cors', origin = ORIGIN } = {}) => ({ request: { url: `${origin}${path}`, method, mode } });
	return { self, stores, addedRequests, fetch, fire, request };
};

// The service worker of the library: pages from the network with an offline page, built files from the cache, nothing else touched
describe('buildServiceWorker', () => {
	// Install saves the offline page and its files in the cache of the build, then takes over at once
	it('saves the files of the offline page at install', async () => {
		const worker = runServiceWorker({ code: buildServiceWorker(OPTIONS) });
		await worker.fire('install');
		expect([...worker.stores.get('uv-pwa-b2').keys()]).toEqual(['/offline.html', '/fonts/mono.woff2']);
		expect(worker.self.skipWaiting).toHaveBeenCalled();
	});

	// The files are saved fresh from the server: the browser's own cache could hand over old copies (a CDN can tell it to keep them for a while)
	it('saves the files fresh from the server, not from the browser cache', async () => {
		const worker = runServiceWorker({ code: buildServiceWorker(OPTIONS) });
		await worker.fire('install');
		expect(worker.addedRequests.map(request => request.cache)).toEqual(['reload', 'reload']);
	});

	// Activation deletes the caches of the other builds, keeps the ones of anything else, and takes control of the open pages
	it('deletes the caches of the other builds', async () => {
		const worker = runServiceWorker({ code: buildServiceWorker(OPTIONS), cachedNames: ['uv-pwa-b1', 'uv-pwa-b2', 'something-else'] });
		await worker.fire('activate');
		expect([...worker.stores.keys()]).toEqual(['uv-pwa-b2', 'something-else']);
		expect(worker.self.clients.claim).toHaveBeenCalled();
	});

	// Pages come from the network, and the offline page shows when there is none
	it('shows the offline page when a page cannot load', async () => {
		const worker = runServiceWorker({ code: buildServiceWorker(OPTIONS) });
		await worker.fire('install');
		const online = await worker.fire('fetch', worker.request('/it/markets', { mode: 'navigate' }));
		expect(await online.text()).toBe('from the network');

		// No connection
		worker.fetch.mockImplementation(async () => { throw new TypeError('Failed to fetch'); });
		const offline = await worker.fire('fetch', worker.request('/it/markets', { mode: 'navigate' }));
		expect(await offline.text()).toBe('saved /offline.html');
	});

	// A built file comes from the network the first time, then from the cache, even without a connection
	it('keeps the built files', async () => {
		const worker = runServiceWorker({ code: buildServiceWorker(OPTIONS), network: async () => new Response('chunk') });
		expect(await (await worker.fire('fetch', worker.request('/_nuxt/Ab12.js'))).text()).toBe('chunk');
		worker.fetch.mockImplementation(async () => { throw new TypeError('Failed to fetch'); });
		expect(await (await worker.fire('fetch', worker.request('/_nuxt/Ab12.js'))).text()).toBe('chunk');
		expect(worker.fetch).toHaveBeenCalledTimes(1); // Only the first time: the second one came from the cache
	});

	// The files saved at install come from the cache
	it('serves the saved files from the cache', async () => {
		const worker = runServiceWorker({ code: buildServiceWorker(OPTIONS) });
		await worker.fire('install');
		expect(await (await worker.fire('fetch', worker.request('/fonts/mono.woff2'))).text()).toBe('saved /fonts/mono.woff2');
		expect(worker.fetch).not.toHaveBeenCalled();
	});

	// The data, the build info, other methods and other origins go to the network untouched (the worker doesn't answer them)
	it.each([
		['the API', '/api/markets?page=1', {}],
		['the live updates', '/api/markets/1/realtime-updates', {}],
		['the build info', '/_nuxt/builds/latest.json', {}],
		['a POST', '/api/markets/1/trade', { method: 'POST' }],
		['another origin', '/_nuxt/Ab12.js', { origin: 'https://cdn.example' }]
	])('leaves %s alone', async (_, path, options) => {
		const worker = runServiceWorker({ code: buildServiceWorker(OPTIONS) });
		expect(await worker.fire('fetch', worker.request(path, options))).toBeUndefined();
		expect(worker.fetch).not.toHaveBeenCalled();
	});

	// The removal deletes its caches, unregisters, and reloads the pages so they run without it
	it('removes itself when asked', async () => {
		const worker = runServiceWorker({ code: buildServiceWorker({ ...OPTIONS, selfDestroy: true }), cachedNames: ['uv-pwa-b1', 'something-else'] });
		await worker.fire('activate');
		expect([...worker.stores.keys()]).toEqual(['something-else']);
		expect(worker.self.registration.unregister).toHaveBeenCalled();
	});
});

// The offline page: self-contained, in the colors of the library and the language of the page
describe('buildOfflinePage', () => {
	const texts = {
		en: { title: "You're offline", message: '{name} needs a connection.', retry: 'Try again', note: 'Reloads by itself.' },
		it: { title: 'Sei offline', message: '{name} ha bisogno di una connessione.', retry: 'Riprova', note: 'Si ricarica da sola.' }
	};

	// The name of the app, its logo and its font, and the texts of every language for the script that picks one
	it('writes the page of the app', () => {
		const html = buildOfflinePage({ name: 'KrowdCall', logo: '/images/logo.svg', font: { family: 'JetBrains Mono', regular: '/fonts/r.woff2', bold: '/fonts/b.woff2' }, texts });
		expect(html).toContain('<title>KrowdCall</title>');
		expect(html).toContain('<img src="/images/logo.svg" alt="">');
		expect(html).toContain('KrowdCall needs a connection.');
		expect(html).toContain('src: url("/fonts/r.woff2")');
		expect(html).toContain('"it":{"title":"Sei offline"');
	});

	// A dark logo shows on the dark theme, and the light one on the light theme
	it('switches the logo with the theme', () => {
		const html = buildOfflinePage({ name: 'App', logo: '/logo.svg', logoDark: '/logo-dark.svg', texts });
		expect(html).toContain('<img class="logo-light" src="/logo.svg" alt=""><img class="logo-dark" src="/logo-dark.svg" alt="">');
		expect(html).toContain(':root.dark .logo-light, :root.light .logo-dark { display: none; }');
	});

	// A name with markup is written as text, and can't end the script that holds the texts
	it('escapes the name of the app', () => {
		const html = buildOfflinePage({ name: '</script><b>App</b>', texts });
		expect(html).not.toContain('</script><b>');
		expect(html).toContain('&lt;/script&gt;&lt;b&gt;App&lt;/b&gt;');
	});
});

// The manifest of the app, one per language
describe('buildManifests', () => {
	const manifest = {
		description: { en: 'Predict with friends', it: 'Prevedi con gli amici' },
		startUrl: { en: '/markets', it: '/it/markets' },
		themeColor: '#fafafa',
		icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
		shortcuts: [{ name: { en: 'Search', it: 'Cerca' }, url: { en: '/search', it: '/it/search' }, icon: '/shortcuts/search.png' }],
		screenshots: [{ src: '/store/explore.png', sizes: '1080x1920', formFactor: 'narrow', label: { en: 'Explore', it: 'Esplora' } }]
	};

	// One manifest per language, the same identity, and each with its own texts and links
	it('writes a manifest for each language', () => {
		const { defaultLocale, manifests } = buildManifests({ name: 'KrowdCall', scope: '/', manifest });
		expect(defaultLocale).toBe('en');
		expect(Object.keys(manifests)).toEqual(['en', 'it']);
		expect(manifests.it).toMatchObject({ id: '/', lang: 'it', description: 'Prevedi con gli amici', start_url: '/it/markets', display: 'standalone', theme_color: '#fafafa' });
		expect(manifests.it.shortcuts).toEqual([{ name: 'Cerca', url: '/it/search', icons: [{ src: '/shortcuts/search.png', sizes: '96x96', type: 'image/png' }] }]);
		expect(manifests.en.screenshots[0]).toEqual({ src: '/store/explore.png', sizes: '1080x1920', type: 'image/png', form_factor: 'narrow', label: 'Explore' });
	});

	// Opening the app again reuses its window, and options left out don't appear
	it('reuses the window and leaves out what is not set', () => {
		const { manifests } = buildManifests({ name: 'App', scope: '/', manifest: { icons: [] } });
		expect(manifests.en.launch_handler).toEqual({ client_mode: ['navigate-existing', 'auto'] });
		expect(manifests.en).not.toHaveProperty('orientation');
		expect(manifests.en).not.toHaveProperty('shortcuts');
		expect(manifests.en.start_url).toBe('/');
	});
});

// The proof that the Android app and the site belong together
describe('buildAssetLinks', () => {
	// The package of the app and the fingerprint of its signing key, in the format Android checks
	it('writes the asset links of the Android app', () => {
		expect(JSON.parse(buildAssetLinks({ packageName: 'com.krowdcall.app', sha256CertFingerprints: 'AB:CD' }))).toEqual([{
			relation: ['delegate_permission/common.handle_all_urls'],
			target: { namespace: 'android_app', package_name: 'com.krowdcall.app', sha256_cert_fingerprints: ['AB:CD'] }
		}]);
	});
});