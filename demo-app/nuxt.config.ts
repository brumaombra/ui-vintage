import tailwindcss from '@tailwindcss/vite';
import { createAppRoutesList } from './app/composables/useCreateAppRoutesList.js';

export default defineNuxtConfig({
	srcDir: 'app/',

	ssr: true,

	app: {
		// Global head configuration
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
			}],

			// Apply the saved theme before the first paint (the prerendered HTML would otherwise flash light until the theme selector mounts)
			script: [{
				innerHTML: "try{var t=localStorage.getItem('theme');document.documentElement.classList.add(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light')}catch(e){}"
			}],

			// Without JavaScript (some crawlers), show the elements that AOS keeps hidden until it animates them
			noscript: [{
				innerHTML: '<style>[data-aos]{opacity:1!important;transform:none!important}</style>'
			}]
		},

		// Global page transition (blur and rise, the styles live in the library stylesheet)
		pageTransition: {
			name: 'page',
			mode: 'out-in'
		}
	},

	router: {
		options: {
			// Smooth scroll to section anchors (waits for the page transition)
			scrollBehaviorType: 'smooth'
		}
	},

	css: [
		'~/assets/main.css'
	],

	// No source maps, as we don't need them (It saves memory during the build process)
	sourcemap: {
		server: false,
		client: false
	},

	build: {
		// Library dependencies installed only in the parent folder: bundle them, otherwise at runtime they import the parent's copy of Vue
		transpile: ['reka-ui', '@floating-ui/vue', 'vue-demi', '@tanstack/vue-virtual', '@vueuse/core', '@vueuse/shared']
	},

	vite: {
		// Vite plugins
		plugins: [
			tailwindcss()
		],

		// Vite resolve options
		resolve: {
			// The library is linked from the parent folder, which has its own node_modules: resolve these from the demo app so the server render has a single copy of Vue
			dedupe: ['vue', 'vue-i18n', 'nuxt', '@hugeicons/vue']
		},

		// Vite build options
		build: {
			reportCompressedSize: false // Skip gzipping every chunk just to log its size
		},

		// Vite optimization options
		optimizeDeps: {
			include: [
				'@hugeicons/core-free-icons',
				'@hugeicons/vue',
				'@internationalized/date',
				'@vueuse/core',
				'aos', // CJS
				'class-variance-authority',
				'clsx',
				'reka-ui',
				'reka-ui/date',
				'shiki',
				'tailwind-merge'
			]
		}
	},

	modules: [
		'@brumaombra/ui-vintage',
		'@nuxt/content',
		'@nuxtjs/i18n'
	],

	content: {
		// Experimental features
		experimental: {
			sqliteConnector: 'native' // Use the built-in node:sqlite module instead of better-sqlite3 (no native build)
		}
	},

	i18n: {
		baseUrl: 'https://ui-vintage.brumaombra.com',
		defaultLocale: 'en',
		langDir: 'locales',
		detectBrowserLanguage: false,
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

	nitro: {
		// Skip gzipping every output file just to log its size
		logging: {
			compressedSizes: false
		},

		// Prerender dynamic routes
		prerender: {
			// Write each page as "about.html" (not "about/index.html"): Cloudflare Pages then serves it at "/about" and redirects "/about/" there
			autoSubfolderIndex: false,
			routes: await createAppRoutesList(),
			ignore: ['/this-page-does-not-exist'] // Linked on purpose by the layouts page to show the 404 page
		}
	},

	features: {
		inlineStyles: true
	},

	compatibilityDate: '2026-04-07'
});