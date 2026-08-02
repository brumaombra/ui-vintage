<script setup>
import { Terminal as UiVintageTerminal } from '@brumaombra/ui-vintage/content';

// Props
const props = defineProps({
    commands: { type: Array, default: () => [] },
    title: { type: String },
    prompt: { type: String, default: '$' },
    copyable: { type: Boolean, default: true }
});
</script>

<template>
    <UiVintageTerminal
        :commands="props.commands"
        :title="props.title"
        :prompt="props.prompt"
        :copyable="props.copyable"
    />
</template>