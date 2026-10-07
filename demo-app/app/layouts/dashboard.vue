<script setup lang="ts">
import { computed } from 'vue';
import { NuxtLink } from '#components';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Button } from '@brumaombra/ui-vintage/button';
import { DashboardShell } from '@brumaombra/ui-vintage/dashboard-shell';
import { KbdGroup } from '@brumaombra/ui-vintage/kbd';
import { LanguageSelector } from '@brumaombra/ui-vintage/language-selector';
import { ThemeSelector } from '@brumaombra/ui-vintage/theme-selector';
import { TooltipProvider } from '@brumaombra/ui-vintage/tooltip';
import DemoCommandPalette from '~/components/demo/DemoCommandPalette.vue';
import { demoNavigation, findDemoPage } from '~/utils/demo-navigation';

const route = useRoute();
const localePath = useLocalePath();
const { locale, locales, setLocale } = useI18n();
const languageOptions = computed(() => locales.value.map(language => language.code));
const paletteOpen = useState('demo-palette-open', () => false);

// Route path without the locale prefix (e.g. /it/foundations -> /foundations)
const basePath = computed(() => {
    const prefix = route.path.split('/')[1] ?? '';
    const isLocalePrefix = locales.value.some(language => language.code === prefix);
    return isLocalePrefix ? route.path.slice(prefix.length + 1) || '/' : route.path;
});

// Page that matches the current route in any locale
const currentPage = computed(() => findDemoPage(basePath.value));

// Sidebar navigation derived from the shared navigation model
const sidebarSections = computed(() => demoNavigation.map(group => ({
    id: group.id,
    label: group.label,
    items: group.items.map(page => ({
        id: page.id,
        label: page.label,
        description: page.description,
        icon: page.icon,
        to: localePath(page.to),
        active: currentPage.value?.id === page.id
    }))
})));

// Apply a selected language
const handleSelectLanguage = async (language: string) => {
    await setLocale(language as typeof locale.value);
};
</script>

<template>
    <TooltipProvider>
        <DashboardShell :title="currentPage?.label ?? 'UI Vintage'" :description="currentPage?.description ?? ''" :sidebar-sections="sidebarSections" :sidebar-link-component="NuxtLink" compact>
            <!-- Brand -->
            <template #sidebar-header>
                <NuxtLink :to="localePath('/')" class="group/brand flex items-center gap-3 px-1">
                    <span class="flex size-9 items-center justify-center rounded bg-primary text-sm font-semibold text-primary-foreground">
                        UV
                    </span>
                    <span class="flex flex-col leading-tight">
                        <span class="text-sm font-semibold tracking-tight">UI Vintage</span>
                        <span class="text-[11px] text-muted-foreground">Nuxt component library</span>
                    </span>
                </NuxtLink>
            </template>

            <!-- Search trigger -->
            <template #topbar-trailing>
                <Button variant="secondary" size="sm" class="hidden w-64 justify-between text-muted-foreground md:inline-flex" @click="paletteOpen = true">
                    <span class="flex items-center gap-2">
                        <HugeiconsIcon :icon="Search01Icon" class="size-4" />
                        Search...
                    </span>
                    <KbdGroup :keys="['mod', 'k']" />
                </Button>
                <Button variant="secondary" size="icon-sm" class="md:hidden" aria-label="Search" @click="paletteOpen = true">
                    <HugeiconsIcon :icon="Search01Icon" class="size-4" />
                </Button>
                <ThemeSelector />
            </template>

            <!-- Sidebar footer -->
            <template #sidebar-footer>
                <div class="flex items-center justify-between gap-2">
                    <LanguageSelector :model-value="locale" :languages="languageOptions" @select="handleSelectLanguage" />
                    <span class="text-[11px] text-muted-foreground">MIT licensed</span>
                </div>
            </template>

            <!-- Page content -->
            <slot />
        </DashboardShell>

        <!-- Global command palette -->
        <DemoCommandPalette v-model:open="paletteOpen" />
    </TooltipProvider>
</template>