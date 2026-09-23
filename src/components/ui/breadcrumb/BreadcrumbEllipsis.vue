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
    <span data-slot="breadcrumb-ellipsis" role="presentation" aria-hidden="true" :class="cn('flex size-9 items-center justify-center', props.class)">
        <!-- Default slot content -->
        <slot>
            <HugeiconsIcon :icon="MoreHorizontalIcon" class="size-4" />
        </slot>

        <!-- Screen reader text for accessibility -->
        <span class="sr-only">{{ t('uiVintage.common.more') }}</span>
    </span>
</template>