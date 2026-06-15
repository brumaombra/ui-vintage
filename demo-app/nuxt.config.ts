import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { defineNuxtConfig } from 'nuxt/config';
import type { PluginOption } from 'vite';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const librarySrcDir = resolve(workspaceRoot, 'src');

export default defineNuxtConfig({
    srcDir: 'app/',

    ssr: false,

    app: {
        head: {
            title: 'UI Vintage Demo'
        }
    },

    modules: [
        '@nuxtjs/i18n',
        '@nuxt/image'
    ],

    vite: {
        plugins: [
            tailwindcss() as unknown as PluginOption
        ],
        resolve: {
            alias: [{
                find: /^@brumaombra\/ui-vintage\/style\.css$/,
                replacement: resolve(librarySrcDir, 'styles.css')
            }, {
                find: /^@brumaombra\/ui-vintage\/utils$/,
                replacement: resolve(librarySrcDir, 'lib/utils.ts')
            }, {
                find: /^@brumaombra\/ui-vintage\/i18n$/,
                replacement: resolve(librarySrcDir, 'lib/i18n.ts')
            }, {
                find: /^@brumaombra\/ui-vintage\/(background-grid|blog|busy-indicator|confirm-dialog|dashboard-shell|error-page|landing|message-dialog|slider-form-component|switch-form-component)$/,
                replacement: `${librarySrcDir}/components/$1/index.ts`
            }, {
                find: /^@brumaombra\/ui-vintage\/(landing-content|landing-footer|landing-navbar|landing-shell)$/,
                replacement: `${librarySrcDir}/components/landing/$1/index.ts`
            }, {
                find: /^@brumaombra\/ui-vintage\/([a-z-]+)$/,
                replacement: `${librarySrcDir}/components/ui/$1/index.ts`
            }, {
                find: /^@\//,
                replacement: `${librarySrcDir}/`
            }]
        },
        server: {
            fs: {
                allow: [workspaceRoot]
            }
        },
        optimizeDeps: {
            include: [
                '@hugeicons/core-free-icons',
                '@hugeicons/vue',
                'clsx',
                'tailwind-merge',
                'class-variance-authority',
                'reka-ui',
                '@vueuse/core',
                '@internationalized/date',
                'reka-ui/date'
            ]
        }
    },

    css: [
        '@brumaombra/ui-vintage/style.css',
        '~/assets/main.css'
    ],

    i18n: {
        defaultLocale: 'en',
        detectBrowserLanguage: false,
        langDir: 'locales',
        locales: [
            { code: 'en', language: 'en-US', file: 'en.json' },
            { code: 'it', language: 'it-IT', file: 'it.json' },
            { code: 'fr', language: 'fr-FR', file: 'fr.json' },
            { code: 'es', language: 'es-ES', file: 'es.json' },
            { code: 'de', language: 'de-DE', file: 'de.json' },
            { code: 'pt', language: 'pt-PT', file: 'pt.json' },
            { code: 'zh', language: 'zh-CN', file: 'zh.json' },
            { code: 'ja', language: 'ja-JP', file: 'ja.json' },
            { code: 'ru', language: 'ru-RU', file: 'ru.json' }
        ]
    },

    image: {
        provider: 'ipx'
    },

    devtools: {
        enabled: false
    },

    compatibilityDate: '2026-04-07'
});