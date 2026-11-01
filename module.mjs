import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const moduleRequire = createRequire(import.meta.url);
const consumerRequire = createRequire(resolve(process.cwd(), 'package.json'));

// Resolve Nuxt Kit from either the consumer app or the package itself
const loadNuxtKit = async () => {
	// Attempt to load Nuxt Kit
	for (const specifier of ['@nuxt/kit', 'nuxt/node_modules/@nuxt/kit']) {
		try {
			return await import(specifier);
		} catch { }

		try {
			const resolvedPath = consumerRequire.resolve(specifier);
			return await import(pathToFileURL(resolvedPath).href);
		} catch { }

		try {
			const resolvedPath = moduleRequire.resolve(specifier);
			return await import(pathToFileURL(resolvedPath).href);
		} catch { }
	}

	// Throw an error if Nuxt Kit cannot be resolved
	throw new Error('Unable to resolve @nuxt/kit for @brumaombra/ui-vintage. Install the package dependencies or add Nuxt to the consuming app.');
};

const { addPlugin, addTemplate, createResolver, defineNuxtModule, hasNuxtModule, installModule, updateTemplates } = await loadNuxtKit();
const { version, exports: packageExports } = moduleRequire('./package.json');
const resolver = createResolver(import.meta.url);
const sourceRoot = resolver.resolve('src');
const stylesPath = resolver.resolve('src/styles.css');

/******************************** Tailwind sources ********************************/

// Name of the package, the name the app uses to import the stylesheet, and the line of the stylesheet that scans every library file
const PACKAGE_NAME = '@brumaombra/ui-vintage';
const STYLESHEET_IMPORT = `${PACKAGE_NAME}/style.css`;
const ALL_SOURCES_DIRECTIVE = '@source "./**/*.{ts,vue}";';

// Files of the app that can import the library, and the folders never scanned
const APP_FILE_PATTERN = /\.(vue|js|mjs|cjs|ts|mts|tsx|jsx)$/;
const IGNORED_FOLDERS = new Set(['node_modules', '.nuxt', '.output', '.data', '.git', 'dist']);

// Library files whose classes Tailwind must find (the components, their helpers and their types)
const LIBRARY_SOURCE_PATTERN = /\.(vue|ts)$/;

// Imports of a file: static (import ... from, export ... from) and dynamic (import('...'))
const IMPORT_PATTERN = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)['"]([^'"]+)['"]/g;

// Find the files of a folder and its subfolders that match a pattern
const listFiles = ({ folder, pattern }) => {
	// A missing folder has no files (an app without a layer folder, for example)
	if (!existsSync(folder)) return [];

	// Walk the folder, skipping the generated and installed ones
	return readdirSync(folder, { withFileTypes: true }).flatMap(entry => {
		const path = join(folder, entry.name);
		if (entry.isDirectory()) return IGNORED_FOLDERS.has(entry.name) ? [] : listFiles({ folder: path, pattern });
		return pattern.test(entry.name) ? [path] : [];
	});
};

// Resolve an import to a library file (a relative path inside the library, or a public subpath of the package), or null for any other import
const resolveLibraryImport = ({ specifier, importer }) => {
	// Find the path the import points to
	let target = null;
	if (specifier.startsWith(`${PACKAGE_NAME}/`)) {
		const entryFile = packageExports[`.${specifier.slice(PACKAGE_NAME.length)}`];
		target = typeof entryFile === 'string' ? resolver.resolve(entryFile) : null;
	} else if (specifier.startsWith('.') && importer.startsWith(sourceRoot)) {
		target = resolve(dirname(importer), specifier);
	}

	// Keep only the files of the library sources (with the extensions an import can leave out)
	if (!target || !target.startsWith(sourceRoot)) return null;
	const candidates = [target, `${target}.ts`, `${target}.js`, join(target, 'index.ts'), join(target, 'index.js')];
	return candidates.find(candidate => existsSync(candidate) && statSync(candidate).isFile()) || null;
};

// Collect the library files the app uses: the entry points it imports, and every library file they import in turn
const collectUsedLibraryFiles = (appFolders, extraEntries = []) => {
	const usedFiles = new Set();

	// Follow the imports of a file
	const visit = file => {
		for (const [, specifier] of readFileSync(file, 'utf8').matchAll(IMPORT_PATTERN)) {
			const libraryFile = resolveLibraryImport({ specifier, importer: file });
			if (!libraryFile || usedFiles.has(libraryFile)) continue;
			usedFiles.add(libraryFile);
			visit(libraryFile);
		}
	};

	// Start from the library files the module mounts itself (the connection pill of the service worker, for example)
	for (const entry of extraEntries) {
		usedFiles.add(entry);
		visit(entry);
	}

	// Start from every file of the app
	for (const folder of appFolders) {
		for (const file of listFiles({ folder, pattern: APP_FILE_PATTERN })) visit(file);
	}

	// Return the files that can hold classes, in a stable order (so the stylesheet only changes when the imports do)
	return [...usedFiles].filter(file => LIBRARY_SOURCE_PATTERN.test(file)).sort();
};

// Build the library stylesheet with a source for each used file, instead of every library file
const buildScopedStylesheet = usedFiles => {
	const stylesheet = readFileSync(stylesPath, 'utf8');

	// The stylesheet must still scan every file with the line replaced here
	if (!stylesheet.includes(ALL_SOURCES_DIRECTIVE)) {
		throw new Error(`@brumaombra/ui-vintage: ${ALL_SOURCES_DIRECTIVE} is missing from src/styles.css`);
	}

	// Replace it with the used files (absolute paths, since the stylesheet is written to the build folder of the app)
	const sources = usedFiles.map(file => `@source "${file.replaceAll('\\', '/')}";`).join('\n');
	return stylesheet.replace(ALL_SOURCES_DIRECTIVE, `/* Library files used by the app (found by the @brumaombra/ui-vintage module) */\n${sources}`);
};

/******************************** Service worker ********************************/

// Join paths of the app without doubled slashes ("/" + "/sw.js" -> "/sw.js")
const joinPath = (...parts) => `/${parts.join('/').split('/').filter(Boolean).join('/')}`;

// Texts of the offline page in every language of the library
const readOfflineTexts = () => {
	const folder = resolver.resolve('src/i18n');
	return Object.fromEntries(readdirSync(folder).filter(file => file.endsWith('.json')).map(file => [file.replace('.json', ''), JSON.parse(readFileSync(join(folder, file), 'utf8')).uiVintage.pwa.offline]));
};

// Library files the module mounts on its own (no app imports them, so the style scanner starts from them too)
const moduleMountedFiles = [];

// Write the service worker and the offline page as static files of the build (so they work for server and static apps alike), and register the service worker in the browser (production builds only)
const setupPwa = async ({ options, nuxt }) => {
	const { buildOfflinePage, buildServiceWorker } = await import(pathToFileURL(resolver.resolve('src/runtime/pwa/builders.mjs')).href);
	const baseURL = nuxt.options.app.baseURL || '/';
	const scope = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;
	const swPath = joinPath(baseURL, 'sw.js');
	const offlinePath = joinPath(baseURL, 'offline.html');
	const buildAssetsDir = `${joinPath(baseURL, nuxt.options.app.buildAssetsDir || '/_nuxt/')}/`;
	const selfDestroy = Boolean(options.selfDestroy);

	// Paths saved at install: the offline page, its logo and its font files, and the ones the app adds
	const precache = [...new Set([offlinePath, options.logo, options.logoDark, options.font?.regular, options.font?.bold, ...(options.precache || [])].filter(Boolean))];

	// The service worker of this build (the build id names its cache, so each build gets its own and the old one is deleted)
	const serviceWorker = addTemplate({
		filename: 'ui-vintage/pwa/sw.js',
		write: true,
		getContents: () => buildServiceWorker({ version: nuxt.options.buildId, precache, buildAssetsDir, offlinePath, selfDestroy })
	});

	// The offline page, in every language of the library
	addTemplate({
		filename: 'ui-vintage/pwa/offline.html',
		write: true,
		getContents: () => buildOfflinePage({ name: options.name || 'App', logo: options.logo, logoDark: options.logoDark, font: options.font, texts: readOfflineTexts() })
	});

	// Serve the folder of both files at the root of the app
	nuxt.options.nitro.publicAssets ||= [];
	nuxt.options.nitro.publicAssets.push({ dir: dirname(serviceWorker.dst), baseURL: '/', maxAge: 0 });

	// Never kept by the browser or a CDN, so a new build is found at once (the rules the app already set for these paths come first)
	nuxt.options.routeRules ||= {};
	nuxt.options.routeRules[swPath] = { ...nuxt.options.routeRules[swPath], headers: { 'Cache-Control': 'no-cache', ...nuxt.options.routeRules[swPath]?.headers } };
	nuxt.options.routeRules[offlinePath] = { ...nuxt.options.routeRules[offlinePath], headers: { 'Cache-Control': 'no-cache', 'X-Robots-Tag': 'noindex', ...nuxt.options.routeRules[offlinePath]?.headers } };

	// What the plugin needs in the browser
	const offlineIndicator = options.offlineIndicator !== false;
	nuxt.options.runtimeConfig.public.uiVintagePwa = { enabled: !nuxt.options.dev, path: swPath, scope, selfDestroy, offlineIndicator };

	// The connection pill gets its classes like an imported component
	if (offlineIndicator) moduleMountedFiles.push(resolver.resolve('src/runtime/pwa/OfflineIndicator.vue'));

	// The registration in the browser
	addPlugin({ src: resolver.resolve('src/runtime/pwa/plugin.client.ts'), mode: 'client' });
};

export default defineNuxtModule({
	// Module meta information
	meta: {
		name: '@brumaombra/ui-vintage',
		configKey: 'uiVintage',
		version,
		compatibility: {
			nuxt: '>=4.0.0'
		}
	},

	// Default options
	defaults: {
		scanAllComponents: false, // Let Tailwind scan every library file, instead of only the ones the app imports
		pwa: false // Service worker, offline page and connection pill ({ name, logo, logoDark, font, precache, offlineIndicator, selfDestroy }, see setupPwa)
	},

	// Module main function
	async setup(options, nuxt) {
		// Let Tailwind generate the classes of the library files the app uses, unless every file is wanted
		let appStylesPath = stylesPath;
		if (!options.scanAllComponents) {
			// Folders of the app and of its layers, where the library is imported
			const appFolders = [...new Set(nuxt.options._layers.map(layer => layer.config.srcDir))];

			// Write the stylesheet with the used files to the build folder (on each build, and again when the app files change in development)
			const template = addTemplate({
				filename: 'ui-vintage/style.css',
				write: true,
				getContents: () => buildScopedStylesheet(collectUsedLibraryFiles(appFolders, moduleMountedFiles))
			});
			appStylesPath = template.dst;

			// The app imports the stylesheet by its package name: point that name to the written one
			nuxt.options.alias[STYLESHEET_IMPORT] = appStylesPath;

			// Write it again when a file of the app changes, since its imports may have changed
			nuxt.hook('builder:watch', async (event, path) => {
				if (!APP_FILE_PATTERN.test(path)) return;
				await updateTemplates({ filter: updatedTemplate => updatedTemplate.filename === template.filename });
			});
		}

		// Inject the shared library stylesheet once
		if (!nuxt.options.css.includes(appStylesPath)) {
			nuxt.options.css.push(appStylesPath);
		}

		// Transpile the published source so consuming apps can import it directly
		const cleanSourceRoot = sourceRoot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		nuxt.options.build.transpile.push(new RegExp(`^${cleanSourceRoot}`));

		// Ensure Nuxt Image is available for components that render NuxtImg
		if (!hasNuxtModule('@nuxt/image', nuxt)) {
			await installModule('@nuxt/image');
		}

		// Add the plugin to merge the library translations into the app i18n instance at runtime
		addPlugin({
			src: resolver.resolve('src/runtime/ui-vintage-i18n-plugin.ts')
		});

		// Add the service worker and its offline page, when the app asks for them
		if (options.pwa) {
			await setupPwa({ options: options.pwa === true ? {} : options.pwa, nuxt });
		}
	}
});