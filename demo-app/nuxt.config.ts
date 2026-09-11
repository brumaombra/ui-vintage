import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
    srcDir: 'app/',

    ssr: false,

    app: {
        head: {
            // App title
            title: 'UI Vintage Demo',

            // Preload fonts
            link: [{
                rel: 'preload',
                href: '/fonts/jetbrains-mono/JetBrainsMono-Regular.woff2',
                as: 'font',
                type: 'font/woff2',
                crossorigin: 'anonymous'
            }, {
                rel: 'preload',
                href: '/fonts/jetbrains-mono/JetBrainsMono-SemiBold.woff2',
                as: 'font',
                type: 'font/woff2',
                crossorigin: 'anonymous'
            }, {
                rel: 'preload',
                href: '/fonts/jetbrains-mono/JetBrainsMono-Bold.woff2',
                as: 'font',
                type: 'font/woff2',
                crossorigin: 'anonymous'
            }]
        }
    },

    modules: [
        '@brumaombra/ui-vintage',
        '@nuxt/content',
        '@nuxtjs/i18n'
    ],

    vite: {
        plugins: [
            tailwindcss()
        ],
        optimizeDeps: {
            include: [
                '@brumaombra/ui-vintage',
                '@hugeicons/core-free-icons',
                '@hugeicons/vue',
                '@internationalized/date',
                '@vueuse/core',
                'class-variance-authority',
                'clsx',
                'reka-ui',
                'reka-ui/date',
                'shiki',
                'tailwind-merge'
            ]
        }
    },

    css: [
        '~/assets/main.css'
    ],

    i18n: {
        baseUrl: 'https://ui-vintage-demo.local',
        defaultLocale: 'en',
        detectBrowserLanguage: false,
        langDir: 'locales',
        locales: [
            { code: 'en', language: 'en-US', file: 'en.json' },
            { code: 'it', language: 'it-IT', file: 'it.json' }
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