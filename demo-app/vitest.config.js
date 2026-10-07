import { defineVitestProject } from '@nuxt/test-utils/config';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        projects: [
            // Library logic (helpers, runtime state, theme storage, locales): plain Node, no Nuxt app
            {
                test: {
                    name: 'unit',
                    environment: 'node',
                    include: ['tests/unit/**/*.test.js']
                }
            },

            // Library components: mounted inside the demo Nuxt app (NuxtImg, NuxtLinkLocale, i18n...) in a simulated browser
            await defineVitestProject({
                // The library is linked from the parent folder: keep a single copy of Vue for it and its Reka UI primitives
                resolve: {
                    dedupe: ['vue', 'vue-i18n']
                },
                test: {
                    name: 'app',
                    server: {
                        deps: {
                            inline: ['reka-ui']
                        }
                    },
                    environment: 'nuxt',
                    include: ['tests/app/**/*.test.js'],
                    hookTimeout: 120000, // Booting the Nuxt app for each file can take more than the default 10s when files run in parallel
                    testTimeout: 30000, // The first mount of a component transforms its whole import tree, which can exceed the default 5s on slow machines
                    environmentOptions: {
                        nuxt: {
                            domEnvironment: 'happy-dom'
                        }
                    }
                }
            })
        ]
    }
});
