<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { useI18n } from 'vue-i18n';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();

const { t } = useI18n();
</script>

<template>
    <nav :aria-label="t('uiVintage.common.breadcrumb')" data-slot="breadcrumb" :class="props.class">
        <slot />
    </nav>
</template>