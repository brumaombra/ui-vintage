<script setup>
import { computed } from 'vue';
import { DashboardSquare01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Button } from '@brumaombra/ui-vintage/button';
import { LandingContent, LandingFooter, LandingNavbar, LandingShell } from '@brumaombra/ui-vintage/landing';
import { LanguageSelector } from '@brumaombra/ui-vintage/language-selector';
import { ThemeSelector } from '@brumaombra/ui-vintage/theme-selector';
import { NuxtLink } from '#components';

const { t, locale, locales, setLocale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

// Show reading progress on individual blog posts only
const showBlogProgress = computed(() => /^.*\/blog\/(?!(?:categories|tags)(?:\/|$))[^/]+\/?$/.test(route.path));

// Available language codes for the selector
const languageOptions = computed(() => {
    return locales.value.map(language => language.code);
});

// Footer links (the library section ties the blog back to the component docs)
const footerSections = computed(() => [{
    id: 'blog',
    title: t('navigation.breadcrumbs.blog'),
    links: [{
        id: 'blog',
        label: t('blog.allPosts'),
        to: localePath('/blog')
    }, {
        id: 'categories',
        label: t('navigation.breadcrumbs.categories'),
        to: localePath('/blog/categories')
    }, {
        id: 'tags',
        label: t('navigation.breadcrumbs.tags'),
        to: localePath('/blog/tags')
    }]
}, {
    id: 'library',
    title: t('navigation.library'),
    links: [{
        id: 'overview',
        label: t('navigation.overview'),
        to: localePath('/')
    }, {
        id: 'components',
        label: t('navigation.components'),
        to: localePath('/components/actions')
    }, {
        id: 'foundations',
        label: t('navigation.foundations'),
        to: localePath('/foundations')
    }, {
        id: 'github',
        label: 'GitHub',
        to: 'https://github.com/brumaombra/ui-vintage',
        newTab: true
    }]
}]);

// Apply a selected language
const handleSelectLanguage = async language => {
    await setLocale(language);
};
</script>

<template>
    <LandingShell>
        <!-- Navbar -->
        <template #navbar>
            <LandingNavbar :show-progress="showBlogProgress">
                <!-- Brand (same mark as the component docs) -->
                <template #left>
                    <NuxtLink :to="localePath('/blog')" class="group/brand flex items-center gap-3 rounded outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45">
                        <span class="flex size-9 items-center justify-center rounded bg-primary text-sm font-semibold text-primary-foreground">
                            UV
                        </span>
                        <span class="flex flex-col leading-tight">
                            <span class="text-sm font-semibold tracking-tight">UI Vintage</span>
                            <span class="text-[11px] text-muted-foreground">{{ t('navigation.breadcrumbs.blog') }}</span>
                        </span>
                    </NuxtLink>
                </template>

                <!-- Right side -->
                <template #right>
                    <!-- Back to the component docs -->
                    <Button variant="secondary" size="sm" as-child class="hidden sm:inline-flex">
                        <NuxtLink :to="localePath('/')">
                            <HugeiconsIcon :icon="DashboardSquare01Icon" />
                            {{ t('navigation.components') }}
                        </NuxtLink>
                    </Button>

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
            <LandingFooter app-name="UI Vintage"
                app-logo="/logo.svg"
                app-logo-dark="/logo-dark.svg"
                :app-link-to="localePath('/blog')"
                :app-description="t('blog.footerDescription')"
                :sections="footerSections"
                :link-component="NuxtLink"
                author-name="Bruma"
                author-link="https://brumaombra.com" />
        </template>
    </LandingShell>
</template>