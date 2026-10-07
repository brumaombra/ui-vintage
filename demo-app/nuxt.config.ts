import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
    srcDir: 'app/',

    ssr: false,

    app: {
        // Blur-and-rise transition between pages (styles live in the library stylesheet)
        pageTransition: { name: 'page', mode: 'out-in' },

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

    router: {
        options: {
            // Smooth scroll to section anchors (waits for the page transition)
            scrollBehaviorType: 'smooth'
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
                '@hugeicons/core-free-icons',
                '@hugeicons/vue',
                '@internationalized/date',
                '@vueuse/core',
                'class-variance-authority',
                'clsx',
                'reka-ui',
                'reka-ui/date',
                'shiki',
                'tailwind-merge',
                'aos' // CJS
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

    content: {
        experimental: {
            sqliteConnector: 'native' // Use the built-in node:sqlite module instead of better-sqlite3 (no native build)
        }
    },

    image: {
        // Remote hosts the default IPX provider may fetch and optimise (blog covers and avatars)
        domains: ['images.unsplash.com']
    },

    devtools: {
        enabled: false
    },

    compatibilityDate: '2026-04-07'
});