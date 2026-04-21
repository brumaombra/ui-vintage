<script setup lang="ts">
import { computed } from 'vue';
import EnglishFlag from './flags/EnglishFlag.vue';
import ItalianFlag from './flags/ItalianFlag.vue';

// Props
const props = defineProps({
    code: { type: String, default: 'en' }
});

// Map of language codes to flag components
const flagComponentMap = {
    en: EnglishFlag,
    it: ItalianFlag
} as const;

// Get the appropriate flag component based on the code prop
const flagComponent = computed(() => {
    return flagComponentMap[props.code as keyof typeof flagComponentMap] || EnglishFlag;
});
</script>

<template>
    <component :is="flagComponent" v-bind="$attrs" />
</template>