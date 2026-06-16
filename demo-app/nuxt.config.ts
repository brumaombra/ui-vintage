import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
    srcDir: 'app/',

    ssr: false,

    app: {
        head: {
            title: 'UI Vintage Demo'
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
                'clsx',
                'tailwind-merge',
                'class-variance-authority',
                'reka-ui',
                '@vueuse/core',
                '@internationalized/date',
                'reka-ui/date',
                '@brumaombra/ui-vintage'
            ]
        }
    },

    css: [
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