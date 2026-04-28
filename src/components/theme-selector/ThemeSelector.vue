<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ComputerIcon, GibbousMoonIcon, Sun01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const { t } = useI18n();
const isOpen = ref(false);
const currentTheme = ref('auto');
let mediaQueryList: MediaQueryList | undefined;
let handleSystemThemeChange: (() => void) | undefined;

// Resolve the icon for each theme mode
const getThemeIcon = (theme: string) => {
    if (theme === 'light') {
        return Sun01Icon;
    } else if (theme === 'dark') {
        return GibbousMoonIcon;
    } else {
        return ComputerIcon;
    }
};

// Available themes
const themes = computed(() => [
    { id: 'light', label: t('uiVintage.theme.light') },
    { id: 'dark', label: t('uiVintage.theme.dark') },
    { id: 'auto', label: t('uiVintage.theme.auto') }
]);

// Check if system prefers dark mode
const isSystemDarkPreferred = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Apply the selected theme to the document
const applyTheme = (theme: string) => {
    document.documentElement.classList.remove('light', 'dark');

    // If auto is selected, apply the theme based on system preference
    if (theme === 'auto') {
        if (isSystemDarkPreferred()) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.add('light');
        }
    } else {
        document.documentElement.classList.add(theme);
    }

    // Persist the selected theme in localStorage
    localStorage.setItem('theme', theme);
};

// Handle theme selection from the menu
const handleSelectTheme = (theme: string) => {
    currentTheme.value = theme;
    applyTheme(theme);
    isOpen.value = false;
};

// Compute the icon for the currently selected theme
const currentThemeIcon = computed(() => {
    return getThemeIcon(currentTheme.value);
});

// Theme options for the menu
const themeOptions = computed(() => {
    return themes.value.map(theme => ({
        key: theme.id,
        label: theme.label,
        icon: getThemeIcon(theme.id)
    }));
});

// On component mounted
onMounted(() => {
    const savedTheme = localStorage.getItem('theme') || 'auto';
    currentTheme.value = savedTheme;
    applyTheme(savedTheme);
    mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

    // Handler to update the theme
    handleSystemThemeChange = () => {
        if (currentTheme.value === 'auto') {
            applyTheme('auto');
        }
    };

    // Listen for changes in system theme preference
    mediaQueryList.addEventListener('change', handleSystemThemeChange);
});

// Cleanup system preference listener
onUnmounted(() => {
    if (mediaQueryList && handleSystemThemeChange) {
        mediaQueryList.removeEventListener('change', handleSystemThemeChange);
    }
});
</script>

<template>
    <Popover v-model:open="isOpen">
        <!-- Trigger button showing the current theme icon -->
        <PopoverTrigger as-child>
            <Button variant="secondary" size="icon" :aria-label="t('uiVintage.theme.ariaLabel')">
                <HugeiconsIcon :icon="currentThemeIcon" class="h-5 w-5" />
            </Button>
        </PopoverTrigger>

        <!-- Theme options -->
        <PopoverContent side="bottom" align="end" :side-offset="8" class="w-44 !p-0">
            <Command :model-value="currentTheme">
                <CommandList>
                    <CommandGroup :heading="t('uiVintage.theme.title')">
                        <CommandItem v-for="option in themeOptions" :key="option.key" :value="option.key" @select="handleSelectTheme(option.key)">
                            <HugeiconsIcon :icon="option.icon" class="size-4" />
                            <span class="flex-1">{{ option.label }}</span>
                            <HugeiconsIcon :icon="Tick02Icon" class="ml-auto size-4 shrink-0" :class="currentTheme === option.key ? 'opacity-100' : 'opacity-0'" />
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>