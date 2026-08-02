<script setup>
import { computed } from 'vue';
import { BellDotIcon, DashboardSquare01Icon, InformationCircleIcon, SlidersHorizontalIcon } from '@hugeicons/core-free-icons';
import { Button } from '@brumaombra/ui-vintage/button';
import { DashboardShell } from '@brumaombra/ui-vintage/dashboard-shell';
import { LanguageSelector } from '@brumaombra/ui-vintage/language-selector';
import { showMessageDialog } from '@brumaombra/ui-vintage/message-dialog';
import { ThemeSelector } from '@brumaombra/ui-vintage/theme-selector';
import { TooltipProvider } from '@brumaombra/ui-vintage/tooltip';

const { locale, locales, setLocale } = useI18n();
const languageOptions = computed(() => locales.value.map(language => language.code));

// Sidebar navigation structure
const sidebarSections = [{
    id: 'overview',
    label: 'Overview',
    items: [{
        id: 'components',
        label: 'Components',
        description: 'Interactive primitives and surfaces',
        icon: DashboardSquare01Icon,
        active: true
    }, {
        id: 'feedback',
        label: 'Feedback',
        description: 'Dialogs, alerts, and busy states',
        icon: BellDotIcon
    }, {
        id: 'controls',
        label: 'Controls',
        description: 'Inputs, selects, sliders, and toggles',
        icon: SlidersHorizontalIcon
    }]
}];

// Apply a selected language
const handleSelectLanguage = async (language) => {
    await setLocale(language);
    localStorage.setItem('language', language);
};

// Show the dashboard introduction dialog
const handleInfoDemo = async () => {
    await showMessageDialog({
        type: 'info',
        icon: InformationCircleIcon,
        title: 'Demo screen',
        message: 'This screen is meant to preview the core components with realistic spacing and interactions.',
        closeText: 'Got it'
    });
};
</script>

<template>
    <TooltipProvider>
        <DashboardShell title="Theme Vintage Demo" description="A compact showcase of the current component library." :sidebar-sections="sidebarSections">
            <!-- Custom sidebar header -->
            <template #sidebar-header>
                <div class="hidden items-center gap-2 sm:flex">
                    <!-- App name -->
                    <span class="rounded border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.16em]">
                        Demo
                    </span>

                    <!-- Quick intro button -->
                    <Button variant="secondary" size="sm" @click="handleInfoDemo">
                        Quick Intro
                    </Button>
                </div>
            </template>

            <!-- Custom sidebar footer -->
            <template #sidebar-footer>
                <div class="flex items-center gap-2">
                    <!-- Language selector -->
                    <LanguageSelector :model-value="locale" :languages="languageOptions" @select="handleSelectLanguage" />

                    <!-- Theme selector -->
                    <ThemeSelector />
                </div>
            </template>

            <!-- Main content slot -->
            <slot />
        </DashboardShell>
    </TooltipProvider>
</template>