<script setup lang="ts">
import type { Component } from 'vue';
import { computed, defineAsyncComponent } from 'vue';

// Single source of truth for supported flag component loaders
const supportedFlagLoaders = {
    en: () => import('./flags/EnglishFlag.vue'),
    it: () => import('./flags/ItalianFlag.vue'),
    fr: () => import('./flags/FrenchFlag.vue'),
    es: () => import('./flags/SpanishFlag.vue'),
    de: () => import('./flags/GermanFlag.vue')
} as const;

type SupportedLanguageCode = keyof typeof supportedFlagLoaders;
const asyncFlagComponentCache = new Map<SupportedLanguageCode, Component>();

// Type guard to ensure a code is one of the supported flag codes
const isSupportedLanguageCode = (code: string): code is SupportedLanguageCode => {
    return code in supportedFlagLoaders;
};

// Load and cache the async component for a given supported language code
const getAsyncFlagComponent = (code: SupportedLanguageCode) => {
    // Check cache first
    const cachedComponent = asyncFlagComponentCache.get(code);
    if (cachedComponent) {
        return cachedComponent;
    }

    // Load the async component and cache it
    const asyncComponent = defineAsyncComponent(supportedFlagLoaders[code]);
    asyncFlagComponentCache.set(code, asyncComponent);
    return asyncComponent;
};

// Props
const props = defineProps({
    code: { type: String, default: 'en' }
});

// Get the appropriate flag component based on the code prop
const flagComponent = computed(() => {
    const resolvedCode = isSupportedLanguageCode(props.code) ? props.code : 'en';
    return getAsyncFlagComponent(resolvedCode);
});
</script>

<template>
    <component :is="flagComponent" v-bind="$attrs" />
</template>