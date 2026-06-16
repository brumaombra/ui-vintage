import { createRequire } from 'node:module';
import { resolve } from 'node:path';
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

const { addPlugin, createResolver, defineNuxtModule, installModule } = await loadNuxtKit();
const resolver = createResolver(import.meta.url);
const sourceRoot = resolver.resolve('src');
const stylesPath = resolver.resolve('src/styles.css');

// Check whether the consuming app already has a specific module installed
const hasModuleInstalled = (modules, moduleName) => {
    return modules.some((entry) => {
        if (typeof entry === 'string') return entry === moduleName;
        if (Array.isArray(entry)) return entry[0] === moduleName;
        return false;
    });
};

export default defineNuxtModule({
    // Module meta information
    meta: {
        name: '@brumaombra/ui-vintage',
        compatibility: {
            nuxt: '>=4.0.0'
        }
    },

    // Module main function
    async setup(_, nuxt) {
        // Inject the shared library stylesheet once
        if (!nuxt.options.css.includes(stylesPath)) {
            nuxt.options.css.push(stylesPath);
        }

        // Transpile the published source so consuming apps can import it directly
        const cleanSourceRoot = sourceRoot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        nuxt.options.build.transpile.push(new RegExp(`^${cleanSourceRoot}`));

        // Ensure Nuxt Image is available for components that render NuxtImg
        if (!hasModuleInstalled(nuxt.options.modules, '@nuxt/image')) {
            await installModule('@nuxt/image');
        }

        // Add the plugin to merge the library translations into the app i18n instance at runtime
        addPlugin({
            src: resolver.resolve('src/runtime/ui-vintage-i18n-plugin.js')
        });
    }
});