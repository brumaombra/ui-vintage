import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
    srcDir: 'app/',

    ssr: false,

    app: {
        head: {
            title: 'Theme Vintage Demo'
        }
    },

    vite: {
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