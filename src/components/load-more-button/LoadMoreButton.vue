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
const resolvedText = computed(() => props.text || t('uiVintage.buttons.loadMore'));
const resolvedLoadingText = computed(() => props.loadingText || t('uiVintage.buttons.loading'));

// Handle click event (ignored while loading, so the button stays focusable without firing twice)
const handleClick = () => {
    if (props.busy) return;
    emits('load-more');
};
</script>

<template>
    <div class="flex justify-center">
        <!-- A single button for both states keeps keyboard focus on it while the next page loads -->
        <Button variant="secondary" :class="['w-full md:w-auto', props.busy && 'cursor-wait']" :aria-disabled="props.busy || undefined" :aria-busy="props.busy || undefined" @click="handleClick">
            <HugeiconsIcon :icon="props.busy ? RefreshIcon : ArrowDown01Icon" :class="['size-4', props.busy && 'animate-spin']" />
            {{ props.busy ? resolvedLoadingText : resolvedText }}
        </Button>
    </div>
</template>
