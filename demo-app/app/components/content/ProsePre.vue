<script setup>
import { computed } from 'vue';
import { Terminal } from '@brumaombra/ui-vintage/content';

// Props
const props = defineProps({
    code: { type: String, default: '' },
    language: { type: String, default: '' }
});

const isShellBlock = computed(() => ['bash', 'sh', 'shell'].includes(props.language.toLowerCase()));
const commands = computed(() => props.code.replace(/\n$/, '').split(/\r?\n/));
</script>

<template>
    <Terminal v-if="isShellBlock" :commands="commands" />
    <pre v-else><slot /></pre>
</template>