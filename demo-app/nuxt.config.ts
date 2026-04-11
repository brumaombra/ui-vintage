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
                find: /^@brumaombra\/ui-vintage\/(background-grid|busy-indicator|confirm-dialog|dashboard-shell|error-page|message-dialog|slider-form-component|switch-form-component)$/,
                replacement: `${librarySrcDir}/components/$1/index.ts`
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

    devtools: {
        enabled: false
    },

    compatibilityDate: '2026-04-07'
});