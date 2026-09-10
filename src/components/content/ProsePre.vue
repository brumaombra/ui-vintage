<script setup lang="ts">
import { computed } from 'vue';
import CodeBlock from './CodeBlock.vue';
import Terminal from './Terminal.vue';

// Props
const props = withDefaults(defineProps<{
    code?: string;
    language?: string;
}>(), {
    code: '',
    language: ''
});

const normalizedLanguage = computed(() => props.language.toLowerCase());
const isShellBlock = computed(() => ['bash', 'sh', 'shell'].includes(normalizedLanguage.value));
const commands = computed(() => props.code.replace(/\n$/, '').split(/\r?\n/));
</script>

<template>
    <!-- Terminal value -->
    <Terminal v-if="isShellBlock" :commands="commands" />

    <!-- Code block -->
    <CodeBlock v-else-if="normalizedLanguage" :code="props.code" :language="normalizedLanguage" />

    <!-- Fallback pre block -->
    <pre v-else><slot /></pre>
</template>