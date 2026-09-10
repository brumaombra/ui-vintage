<script setup>
import { ProsePre as UiVintageProsePre } from '@brumaombra/ui-vintage/content';

// Props
const props = defineProps({
    code: { type: String, default: '' },
    language: { type: String, default: '' }
});
</script>

<template>
    <UiVintageProsePre :code="props.code" :language="props.language">
        <slot />
    </UiVintageProsePre>
</template>