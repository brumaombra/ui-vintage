<script setup lang="ts">
import type { PaginationListItemProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ButtonVariants } from '../button';
import { reactiveOmit } from '@vueuse/core';
import { PaginationListItem } from 'reka-ui';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';
import { buttonVariants } from '../button';

// Props
const props = withDefaults(defineProps<PaginationListItemProps & {
    size?: ButtonVariants['size'];
    class?: HTMLAttributes['class'];
}>(), {
    size: 'icon-sm',
});

const delegatedProps = reactiveOmit(props, 'class', 'size');

const { t } = useI18n();
</script>

<template>
    <PaginationListItem data-slot="pagination-item" :aria-label="t('uiVintage.pagination.page', { page: props.value })" v-bind="delegatedProps" :class="cn(
        buttonVariants({ variant: 'secondary', size: props.size }),
        'tabular-nums',
        'data-selected:border-primary data-selected:bg-primary data-selected:text-primary-foreground data-selected:hover:border-primary data-selected:hover:bg-primary-hover',
        'data-selected:animate-[uv-pagination-pop_380ms_var(--ease-bounce)]',
        props.class
    )">
        <slot>{{ props.value }}</slot>
    </PaginationListItem>
</template>

<style>
@keyframes uv-pagination-pop {
    0% { transform: scale(0.82); }
    100% { transform: scale(1); }
}
</style>