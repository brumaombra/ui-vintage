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
            title: 'Theme Vintage Demo'
        }
    },

    vite: {
        plugins: [
            tailwindcss() as unknown as PluginOption
        ],
        resolve: {
            alias: [{
                find: /^theme-vintage\/style\.css$/,
                replacement: resolve(librarySrcDir, 'styles.css')
            }, {
                find: /^theme-vintage$/,
                replacement: resolve(librarySrcDir, 'index.ts')
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
                'lucide-vue-next',
            ]
        }
    },

    css: [
        'theme-vintage/style.css',
        '~/assets/main.css'
    ],

    devtools: {
        enabled: false
    },

    compatibilityDate: '2026-04-07'
});