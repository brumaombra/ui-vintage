<script setup>
import { Flow as UiVintageFlow } from '@brumaombra/ui-vintage/content';

// Props
const props = defineProps({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    items: { type: Array, default: () => [] },
    orientation: { type: String, default: 'horizontal', validator: value => ['horizontal', 'vertical'].includes(value) }
});
</script>

<template>
    <UiVintageFlow :title="props.title"
        :description="props.description"
        :items="props.items"
        :orientation="props.orientation" />
</template>