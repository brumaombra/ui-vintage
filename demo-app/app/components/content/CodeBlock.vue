<script setup>
import { CodeBlock as UiVintageCodeBlock } from '@brumaombra/ui-vintage/content';

// Props
const props = defineProps({
    code: { type: String, default: '' },
    language: { type: String, default: 'text' },
    title: { type: String, default: '' },
    copyable: { type: Boolean, default: true }
});
</script>

<template>
    <UiVintageCodeBlock :code="props.code"
        :language="props.language"
        :title="props.title"
        :copyable="props.copyable" />
</template>