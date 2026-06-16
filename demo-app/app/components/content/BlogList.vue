<script setup>
import { BlogList as UiVintageBlogList } from '@brumaombra/ui-vintage/content';

// Props
const props = defineProps({
    items: { type: Array, default: () => [] },
    variant: { type: String, default: 'checkmark', validator: value => ['circle', 'checkmark', 'numbered', 'cross'].includes(value) }
});
</script>

<template>
    <UiVintageBlogList :items="props.items" :variant="props.variant" />
</template>