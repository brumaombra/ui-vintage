import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { runWithNuxtContext } from '@nuxt/kit';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

// Whether node:path answers as on Windows (backslashes)
const state = vi.hoisted(() => ({ windowsPaths: false }));

// node:path of the platform, or one that answers with backslashes as on Windows (while Nuxt Kit keeps forward slashes there)
vi.mock('node:path', async () => {
	const { posix } = await vi.importActual('node:path');
	const toPosix = path => path.replaceAll('\\', '/');
	const answer = path => (state.windowsPaths ? path.replaceAll('/', '\\') : path);
	const windowsLike = {
		...posix,
		join: (...parts) => answer(posix.join(...parts.map(toPosix))),
		resolve: (...parts) => answer(posix.resolve(...parts.map(toPosix))),
		dirname: path => answer(posix.dirname(toPosix(path)))
	};
	return { ...windowsLike, default: windowsLike };
});

// node:fs reading paths with either slash, as on Windows
vi.mock('node:fs', async () => {
	const fs = await vi.importActual('node:fs');
	const toPosix = path => (typeof path === 'string' ? path.replaceAll('\\', '/') : path);
	const windowsLike = {
		...fs,
		existsSync: path => fs.existsSync(toPosix(path)),
		statSync: (path, ...rest) => fs.statSync(toPosix(path), ...rest),
		readdirSync: (path, ...rest) => fs.readdirSync(toPosix(path), ...rest),
		readFileSync: (path, ...rest) => fs.readFileSync(toPosix(path), ...rest)
	};
	return { ...windowsLike, default: windowsLike };
});

// Run the module in a bare Nuxt app made of the given folder, and return the library stylesheet it writes
const buildAppStylesheet = async ({ appFolder, windowsPaths }) => {
	const { default: uiVintageModule } = await import('../../../module.mjs');
	state.windowsPaths = windowsPaths;
	try {
		// Set up the module (Nuxt Image counts as installed, so the module doesn't install it)
		const nuxt = {
			_version: '4.0.0',
			options: { rootDir: appFolder, srcDir: appFolder, buildDir: `${appFolder}/.nuxt`, _layers: [{ config: { srcDir: appFolder } }], modules: ['@nuxt/image'], _installedModules: [], _requiredModules: {}, alias: {}, css: [], plugins: [], build: { transpile: [], templates: [] }, runtimeConfig: { public: {} } },
			hook: vi.fn(),
			callHook: vi.fn(async () => {}),
			hooks: { addHooks: vi.fn() }
		};
		await runWithNuxtContext(nuxt, () => uiVintageModule({}, nuxt));

		// Write the stylesheet
		return nuxt.options.build.templates.find(template => template.filename === 'ui-vintage/style.css').getContents();
	} finally {
		state.windowsPaths = false;
	}
};

// Tailwind sources of the library files the app uses
describe('module sources', () => {
	let appFolder = '';

	// App with a page that uses the button
	beforeAll(() => {
		appFolder = mkdtempSync(`${tmpdir()}/ui-vintage-app-`);
		mkdirSync(`${appFolder}/pages`);
		writeFileSync(`${appFolder}/pages/index.vue`, '<script setup>\nimport { Button } from \'@brumaombra/ui-vintage/button\';\n</script>');
	});

	// Delete the app
	afterAll(() => {
		rmSync(appFolder, { recursive: true, force: true });
	});

	// The component files are reached through the relative imports of the entry point, on Linux and macOS as on Windows
	it.each([false, true])('scans the components the app imports (Windows paths: %s)', async windowsPaths => {
		const stylesheet = await buildAppStylesheet({ appFolder, windowsPaths });

		// Expect the entry point, its component and the helpers it imports, with forward slashes
		expect(stylesheet).toMatch(/@source "[^"]*\/src\/components\/ui\/button\/index\.ts";/);
		expect(stylesheet).toMatch(/@source "[^"]*\/src\/components\/ui\/button\/Button\.vue";/);
		expect(stylesheet).toMatch(/@source "[^"]*\/src\/lib\/utils\.ts";/);
		expect(stylesheet).not.toContain('\\');

		// Expect no file the app doesn't use
		expect(stylesheet).not.toContain('/src/components/ui/accordion/');
		expect(stylesheet).not.toContain('@source "./**/*.{ts,vue}";');
	});
});