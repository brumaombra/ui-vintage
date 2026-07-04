<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { LandingContent, LandingFooter, LandingNavbar, LandingShell } from '@brumaombra/ui-vintage/landing';
import { LanguageSelector } from '@brumaombra/ui-vintage/language-selector';
import { ThemeSelector } from '@brumaombra/ui-vintage/theme-selector';

const { locale, locales, setLocale } = useI18n();
const localePath = useLocalePath();

// Available language codes for the selector
const languageOptions = computed(() => {
    return locales.value.map(language => language.code);
});

// Footer links
const footerSections = [{
    id: 'resources',
    title: 'Resources',
    links: [{
        id: 'blog',
        label: 'Blog',
        href: '/blog'
    }, {
        id: 'categories',
        label: 'Categories',
        href: '/blog/categories'
    }, {
        id: 'github',
        label: 'GitHub',
        href: 'https://github.com/brumaombra/ui-vintage',
        newTab: true
    }]
}];

// Apply a selected language
const handleSelectLanguage = async language => {
    await setLocale(language);
    localStorage.setItem('language', language);
};
</script>

<template>
    <LandingShell>
        <!-- Navbar -->
        <template #navbar>
            <LandingNavbar app-name="UI Vintage Demo" :app-link-to="localePath('/')">
                <!-- Right side -->
                <template #right>
                    <!-- Language selector -->
                    <LanguageSelector :model-value="locale" :languages="languageOptions" @select="handleSelectLanguage" />

                    <!-- Theme selector -->
                    <ThemeSelector />
                </template>
            </LandingNavbar>
        </template>

        <!-- Main content -->
        <template #content>
            <LandingContent>
                <slot />
            </LandingContent>
        </template>

        <!-- Footer -->
        <template #footer>
            <LandingFooter app-name="UI Vintage Demo"
                :app-link-to="localePath('/')"
                app-description="A production-like Nuxt demo for the UI Vintage component library."
                :sections="footerSections"
                author-name="Mauro Brambilla"
                author-link="https://github.com/brumaombra" />
        </template>
    </LandingShell>
</template>