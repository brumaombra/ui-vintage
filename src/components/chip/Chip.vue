<script setup lang="ts">
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { computed } from 'vue';
import type { HTMLAttributes } from 'vue';
import { useI18n } from 'vue-i18n';
import { getSurfaceToneClasses, type ToneColor } from '../../lib/color-tokens';
import { cn } from '../../lib/utils';

// Props
const props = withDefaults(defineProps<{
    text: string;
    color?: ToneColor;
    removeLabel?: string;
    class?: HTMLAttributes['class'];
}>(), {
    color: 'gray'
});

const { t } = useI18n();
const resolvedRemoveLabel = computed(() => props.removeLabel || t('uiVintage.buttons.remove'));

// Emits
const emits = defineEmits<{
    remove: []
}>();

// Handle remove button click
const handleRemove = () => {
    emits('remove');
};
</script>

<template>
    <div data-slot="chip" :class="cn('inline-flex items-center gap-2 rounded border px-3 py-2 text-sm font-semibold transition-colors duration-150', getSurfaceToneClasses(props.color), props.class)">
        <!-- Text content -->
        <span class="leading-none">{{ props.text }}</span>

        <!-- Remove button -->
        <button type="button" :aria-label="resolvedRemoveLabel" class="group/remove inline-flex size-4 cursor-pointer items-center justify-center rounded-sm opacity-70 [transition:opacity_150ms,background-color_150ms,scale_300ms_var(--ease-spring)] hover:bg-black/5 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/20 active:scale-75 dark:hover:bg-white/10" @click="handleRemove">
            <HugeiconsIcon :icon="Cancel01Icon" class="size-3 transition-transform duration-300 ease-spring group-hover/remove:rotate-90" />
        </button>
    </div>
</template>