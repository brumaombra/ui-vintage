<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { LaptopIcon, Moon01Icon, Sun01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Button } from '../ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { applyTheme, applyThemeWithTransition, getStoredTheme, type ThemeMode } from './theme-transition';

const { t } = useI18n();
const isOpen = ref(false);
const currentTheme = ref<ThemeMode>('auto');
const triggerRef = ref<InstanceType<typeof Button> | null>(null);
let mediaQueryList: MediaQueryList | undefined;
let handleSystemThemeChange: (() => void) | undefined;

// Resolve the icon for each theme mode
const getThemeIcon = (theme: string) => {
    if (theme === 'light') {
        return Sun01Icon;
    } else if (theme === 'dark') {
        return Moon01Icon;
    } else {
        return LaptopIcon;
    }
};

// Available themes
const themes = computed(() => [
    { id: 'light' as const, label: t('uiVintage.theme.light') },
    { id: 'dark' as const, label: t('uiVintage.theme.dark') },
    { id: 'auto' as const, label: t('uiVintage.theme.auto') }
]);

// Handle theme selection from the menu
const handleSelectTheme = async (theme: ThemeMode) => {
    currentTheme.value = theme;
    isOpen.value = false;

    // Reveal the new theme from the trigger button once the menu has closed
    await nextTick();
    const triggerElement = (triggerRef.value as { $el?: Element } | null)?.$el ?? null;
    await applyThemeWithTransition(theme, triggerElement);
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
    const savedTheme = getStoredTheme();
    currentTheme.value = savedTheme;
    applyTheme(savedTheme);
    mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

    // Handler to update the theme
    handleSystemThemeChange = () => {
        if (currentTheme.value === 'auto') {
            void applyThemeWithTransition('auto');
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
            <Button ref="triggerRef" variant="secondary" size="icon" :aria-label="t('uiVintage.theme.ariaLabel')">
                <Transition mode="out-in" enter-active-class="transition-[rotate,scale,opacity] duration-[420ms] ease-bounce" enter-from-class="-rotate-90 scale-50 opacity-0" leave-active-class="transition-[rotate,scale,opacity] duration-150 ease-snappy" leave-to-class="rotate-90 scale-50 opacity-0">
                    <HugeiconsIcon :key="currentTheme" :icon="currentThemeIcon" class="h-5 w-5" />
                </Transition>
            </Button>
        </PopoverTrigger>

        <!-- Theme options -->
        <PopoverContent side="bottom" align="end" :side-offset="8" class="w-44 p-0!">
            <Command :model-value="currentTheme">
                <CommandList :aria-label="t('uiVintage.theme.title')">
                    <CommandGroup :heading="t('uiVintage.theme.title')" stagger>
                        <CommandItem v-for="option in themeOptions" :key="option.key" :value="option.key" @select="handleSelectTheme(option.key)">
                            <HugeiconsIcon :icon="option.icon" class="size-4" />
                            <span class="flex-1">{{ option.label }}</span>
                            <HugeiconsIcon :icon="Tick02Icon" class="ml-auto size-4 shrink-0 text-primary! transition-[opacity,scale] duration-300 ease-bounce" :class="currentTheme === option.key ? 'scale-100 opacity-100' : 'scale-50 opacity-0'" />
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>