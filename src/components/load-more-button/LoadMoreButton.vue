<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowDown01Icon, RefreshIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Button } from '../ui/button';

// Props
const props = withDefaults(defineProps<{
    busy?: boolean;
    text?: string;
    loadingText?: string;
}>(), {
    busy: false,
    text: '',
    loadingText: ''
});

// Emits
const emits = defineEmits<{
    'load-more': [];
}>();

const { t } = useI18n();
const resolvedText = computed(() => props.text || t('uiVintage.buttons.loadMore') || 'Load more');
const resolvedLoadingText = computed(() => props.loadingText || t('uiVintage.buttons.loading') || 'Loading');

// Handle click event
const handleClick = () => {
    emits('load-more');
};
</script>

<template>
    <div class="flex justify-center">
        <!-- Loading button -->
        <Button v-if="props.busy" variant="secondary" class="w-full md:w-auto" :disabled="true">
            <HugeiconsIcon :icon="RefreshIcon" class="size-4 animate-spin" />
            {{ resolvedLoadingText }}
        </Button>

        <!-- Load more button -->
        <Button v-else variant="secondary" class="w-full md:w-auto" @click="handleClick">
            <HugeiconsIcon :icon="ArrowDown01Icon" class="size-4" />
            {{ resolvedText }}
        </Button>
    </div>
</template>