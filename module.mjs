import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const moduleRequire = createRequire(import.meta.url);
const consumerRequire = createRequire(resolve(process.cwd(), 'package.json'));

const loadNuxtKit = async () => {
    for (const specifier of ['@nuxt/kit', 'nuxt/node_modules/@nuxt/kit']) {
        try {
            return await import(specifier);
        } catch {
        }

        try {
            const resolvedPath = consumerRequire.resolve(specifier);
            return await import(pathToFileURL(resolvedPath).href);
        } catch {
        }

        try {
            const resolvedPath = moduleRequire.resolve(specifier);
            return await import(pathToFileURL(resolvedPath).href);
        } catch {
        }
    }

    throw new Error('Unable to resolve @nuxt/kit for @brumaombra/ui-vintage. Install the package dependencies or add Nuxt to the consuming app.');
};

const { addPluginTemplate, createResolver, defineNuxtModule, installModule } = await loadNuxtKit();

const PACKAGE_NAME = '@brumaombra/ui-vintage';

const resolver = createResolver(import.meta.url);
const sourceRoot = resolver.resolve('src');
const stylesPath = resolver.resolve('src/styles.css');
const locales = ['en', 'it', 'fr', 'es', 'de', 'pt', 'zh', 'ja', 'ru'];
const uiVintageMessages = Object.fromEntries(
    locales.map((locale) => [locale, JSON.parse(readFileSync(resolver.resolve(`src/i18n/${locale}.json`), 'utf8'))])
);

const escapeForRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const hasModuleInstalled = (modules, moduleName) => {
    return modules.some((entry) => {
        if (typeof entry === 'string') {
            return entry === moduleName;
        }

        if (Array.isArray(entry)) {
            return entry[0] === moduleName;
        }

        return false;
    });
};

const i18nPluginTemplate = () => `
import { defineNuxtPlugin } from '#app'

const uiVintageMessages = ${JSON.stringify(uiVintageMessages)}

const isPlainObject = (value) => value && typeof value === 'object' && !Array.isArray(value)

const mergeMessages = (base, override) => {
  const result = { ...base }

  for (const [key, value] of Object.entries(override || {})) {
    if (isPlainObject(value) && isPlainObject(result[key])) {
      result[key] = mergeMessages(result[key], value)
      continue
    }

    result[key] = value
  }

  return result
}

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n

  if (!i18n?.global?.getLocaleMessage || !i18n.global.setLocaleMessage) {
    return
  }

  for (const [locale, messages] of Object.entries(uiVintageMessages)) {
    const currentMessages = i18n.global.getLocaleMessage(locale)
    i18n.global.setLocaleMessage(locale, mergeMessages(messages, currentMessages))
  }
})
`;

export default defineNuxtModule({
    meta: {
        name: PACKAGE_NAME,
        compatibility: {
            nuxt: '>=4.0.0'
        }
    },
    async setup(_, nuxt) {
        if (!nuxt.options.css.includes(stylesPath)) {
            nuxt.options.css.push(stylesPath);
        }

        nuxt.options.build.transpile.push(new RegExp(`^${escapeForRegExp(sourceRoot)}`));

        if (!hasModuleInstalled(nuxt.options.modules, '@nuxt/image')) {
            await installModule('@nuxt/image');
        }

        addPluginTemplate({
            filename: 'ui-vintage-i18n.mjs',
            getContents: i18nPluginTemplate
        });
    }
});