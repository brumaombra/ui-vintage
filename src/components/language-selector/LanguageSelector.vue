<script setup lang="ts">
import type { Component, PropType } from 'vue';
import { computed, defineAsyncComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export type LanguageSelectorCode = string;

// Single source of truth for supported language codes, labels, and flag loaders
const supportedLanguages = [
    { code: 'en', label: 'English', loadFlag: () => import('@/components/language-flag/flags/EnglishFlag.vue') },
    { code: 'it', label: 'Italiano', loadFlag: () => import('@/components/language-flag/flags/ItalianFlag.vue') },
    { code: 'fr', label: 'Francais', loadFlag: () => import('@/components/language-flag/flags/FrenchFlag.vue') },
    { code: 'es', label: 'Espanol', loadFlag: () => import('@/components/language-flag/flags/SpanishFlag.vue') },
    { code: 'de', label: 'Deutsch', loadFlag: () => import('@/components/language-flag/flags/GermanFlag.vue') }
] as const;

type SupportedLanguage = (typeof supportedLanguages)[number];
type SupportedLanguageCode = SupportedLanguage['code'];
const asyncFlagComponentCache = new Map<SupportedLanguageCode, Component>();

// Type guard to ensure a code is one of the supported flag codes
const isSupportedLanguageCode = (code: string): code is SupportedLanguageCode => {
    return supportedLanguages.some((language) => language.code === code);
};

// Get the supported language object for a given code
const getSupportedLanguage = (code: SupportedLanguageCode) => {
    return supportedLanguages.find((language) => language.code === code)!;
};

// Load and cache the async component for a given supported language code
const getAsyncFlagComponent = (code: SupportedLanguageCode) => {
    // Check cache first
    const cachedComponent = asyncFlagComponentCache.get(code);
    if (cachedComponent) {
        return cachedComponent;
    }

    // Load the async component and cache it
    const asyncComponent = defineAsyncComponent(getSupportedLanguage(code).loadFlag);
    asyncFlagComponentCache.set(code, asyncComponent);
    return asyncComponent;
};

// Props
const props = defineProps({
    modelValue: { type: String, default: '' },
    languages: {
        type: Array as PropType<LanguageSelectorCode[]>,
        default: () => ['en', 'it']
    }
});

// Emits
const emits = defineEmits<{
    'update:modelValue': [value: string];
    select: [value: string];
}>();

const { locale, t } = useI18n();
const isOpen = ref(false);

// Build localized language labels from the provided language codes
const languageDisplayNames = computed(() => {
    return typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames([locale.value], { type: 'language' }) : null;
});

// Get the display label for a given language code
const getLanguageLabel = (code: string) => {
    const normalizedCode = code.toLowerCase();
    const languageCode = normalizedCode.split('-')[0];
    const supportedLanguage = isSupportedLanguageCode(languageCode) ? getSupportedLanguage(languageCode) : null;
    return supportedLanguage?.label || languageDisplayNames.value?.of(languageCode) || code.toUpperCase();
};

// Normalize languages to pair each language code with its label
const normalizedLanguages = computed(() => {
    return props.languages.map(code => ({
        code,
        label: getLanguageLabel(code)
    }));
});

// Compute the available flag codes based on the provided language list
const availableFlagCodes = computed<SupportedLanguageCode[]>(() => {
    // Extract supported language codes from the normalized list
    const supportedCodes = normalizedLanguages.value.map(language => language.code).filter(isSupportedLanguageCode);
    if (supportedCodes.length > 0) {
        return [...new Set(supportedCodes)];
    }

    // If no valid codes are provided, default to English
    return ['en'];
});

// Resolve the flag component for a specific code, falling back to the first available code
const resolveFlagComponent = (code?: string) => {
    const isValid = code && isSupportedLanguageCode(code) && availableFlagCodes.value.includes(code);
    const resolvedCode = isValid ? code : availableFlagCodes.value[0];
    return getAsyncFlagComponent(resolvedCode);
};

// Get the currently selected language based on modelValue
const currentLanguage = computed(() => {
    return normalizedLanguages.value.find(language => language.code === props.modelValue) || normalizedLanguages.value[0] || null;
});

// Resolve the async flag component for the currently selected language
const currentFlagComponent = computed(() => {
    return currentLanguage.value ? resolveFlagComponent(currentLanguage.value.code) : null;
});

// Handle language selection
const handleSelectLanguage = (language: string) => {
    emits('update:modelValue', language);
    emits('select', language);
    isOpen.value = false;
};
</script>

<template>
    <Popover v-model:open="isOpen">
        <!-- Trigger button showing the current language flag -->
        <PopoverTrigger as-child>
            <Button variant="secondary" size="icon" :aria-label="t('ui.language.ariaLabel')">
                <component :is="currentFlagComponent" v-if="currentFlagComponent" class="h-4 w-[1.35rem] rounded-[2px]" />
            </Button>
        </PopoverTrigger>

        <!-- Popover content with language options -->
        <PopoverContent side="bottom" align="end" :side-offset="8" class="w-44 !p-0">
            <Command :model-value="props.modelValue">
                <CommandList>
                    <CommandGroup :heading="t('ui.language.title')">
                        <CommandItem v-for="option in normalizedLanguages" :key="option.code" :value="option.code" @select="handleSelectLanguage(option.code)">
                            <component :is="resolveFlagComponent(option.code)" class="h-4 w-[1.35rem] rounded-[2px]" />
                            <span class="flex-1">{{ option.label }}</span>
                            <HugeiconsIcon :icon="Tick02Icon" class="ml-auto size-4 shrink-0" :class="props.modelValue === option.code ? 'opacity-100' : 'opacity-0'" />
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>