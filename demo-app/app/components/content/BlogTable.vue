<script setup>
import { BlogTable as UiVintageBlogTable } from '@brumaombra/ui-vintage/content';

// Props
const props = defineProps({
    headers: { type: Array, default: () => [] },
    rows: { type: Array, default: () => [] },
    highlightCol: { type: Number, default: -1 }
});
</script>

<template>
    <UiVintageBlogTable :headers="props.headers" :rows="props.rows" :highlight-col="props.highlightCol" />
</template>