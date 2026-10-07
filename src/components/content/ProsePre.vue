<script setup lang="ts">
import { computed } from 'vue';
import CodeBlock from './CodeBlock.vue';
import Terminal from './Terminal.vue';

// Nuxt Content passes `shiki` classes; keep them off Terminal and CodeBlock, whose utilities the unlayered `.shiki span` styles override
defineOptions({ inheritAttrs: false });

// Props
const props = withDefaults(defineProps<{
    code?: string;
    language?: string;
    filename?: string;
}>(), {
    code: '',
    language: '',
    filename: ''
});

const normalizedLanguage = computed(() => props.language.toLowerCase());
const isShellBlock = computed(() => ['bash', 'sh', 'shell'].includes(normalizedLanguage.value));
const commands = computed(() => props.code.replace(/\n$/, '').split(/\r?\n/));
</script>

<template>
    <!-- Terminal value -->
    <Terminal v-if="isShellBlock" :commands="commands" :title="props.filename" />

    <!-- Code block -->
    <CodeBlock v-else-if="normalizedLanguage" :code="props.code" :language="normalizedLanguage" :title="props.filename" />

    <!-- Fallback pre block -->
    <pre v-else v-bind="$attrs"><slot /></pre>
</template>