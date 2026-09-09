<script setup>
import { computed } from 'vue';
import { Code } from '@brumaombra/ui-vintage/content';
import { Terminal } from '@brumaombra/ui-vintage/content';

// Props
const props = defineProps({
    code: { type: String, default: '' },
    language: { type: String, default: '' }
});

const normalizedLanguage = computed(() => props.language.toLowerCase());
const isShellBlock = computed(() => ['bash', 'sh', 'shell'].includes(normalizedLanguage.value));
const isCodeBlock = computed(() => ['json', 'text'].includes(normalizedLanguage.value));
const commands = computed(() => props.code.replace(/\n$/, '').split(/\r?\n/));
</script>

<template>
    <!-- Terminal value -->
    <Terminal v-if="isShellBlock" :commands="commands" />

    <!-- Code block -->
    <Code v-else-if="isCodeBlock" :code="props.code" :language="normalizedLanguage" />

    <!-- Fallback pre block -->
    <pre v-else><slot /></pre>
</template>