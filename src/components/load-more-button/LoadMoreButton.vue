<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowDown01Icon, RefreshIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Button } from '@/components/ui/button';

const props = defineProps({
    busy: { type: Boolean, default: false },
    text: { type: String, default: '' },
    loadingText: { type: String, default: '' }
});

const emits = defineEmits(['load-more']);

const { t } = useI18n();

const resolvedText = computed(() => props.text || t('ui.buttons.loadMore') || 'Load more');
const resolvedLoadingText = computed(() => props.loadingText || t('ui.buttons.loading') || 'Loading');

const handleClick = () => {
    emits('load-more');
};
</script>

<template>
    <div class="flex justify-center">
        <Button v-if="props.busy"
            variant="secondary"
            class="w-full md:w-auto"
            :disabled="true">
            <HugeiconsIcon :icon="RefreshIcon" class="size-4 animate-spin" />
            {{ resolvedLoadingText }}
        </Button>

        <Button v-else
            variant="secondary"
            class="w-full md:w-auto"
            @click="handleClick">
            <HugeiconsIcon :icon="ArrowDown01Icon" class="size-4" />
            {{ resolvedText }}
        </Button>
    </div>
</template>