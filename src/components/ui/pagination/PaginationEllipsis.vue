<script setup lang="ts">
import type { PaginationEllipsisProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { MoreHorizontalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { reactiveOmit } from '@vueuse/core';
import { PaginationEllipsis } from 'reka-ui';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<PaginationEllipsisProps & {
    class?: HTMLAttributes['class'];
}>();

const delegatedProps = reactiveOmit(props, 'class');

const { t } = useI18n();
</script>

<template>
    <PaginationEllipsis data-slot="pagination-ellipsis" v-bind="delegatedProps" :class="cn('flex size-10 items-center justify-center text-muted-foreground', props.class)">
        <!-- Default slot content -->
        <slot>
            <HugeiconsIcon :icon="MoreHorizontalIcon" class="size-4" aria-hidden="true" />
        </slot>

        <!-- Screen reader text for accessibility -->
        <span class="sr-only">{{ t('uiVintage.pagination.more') }}</span>
    </PaginationEllipsis>
</template>