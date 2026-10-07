<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { MoreHorizontalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();

const { t } = useI18n();
</script>

<template>
    <span data-slot="breadcrumb-ellipsis" role="presentation" :class="cn('flex size-6 items-center justify-center rounded-sm transition-colors duration-150 hover:bg-accent hover:text-primary', props.class)">
        <!-- Default slot content -->
        <slot>
            <HugeiconsIcon :icon="MoreHorizontalIcon" class="size-4" aria-hidden="true" />
        </slot>

        <!-- Screen reader text for accessibility -->
        <span class="sr-only">{{ t('uiVintage.common.more') }}</span>
    </span>
</template>