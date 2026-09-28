<script setup lang="ts">
import type { PaginationLastProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ButtonVariants } from '../button';
import { ArrowRightDoubleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { reactiveOmit } from '@vueuse/core';
import { PaginationLast } from 'reka-ui';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';
import { buttonVariants } from '../button';

// Props
const props = withDefaults(defineProps<PaginationLastProps & {
    size?: ButtonVariants['size'];
    class?: HTMLAttributes['class'];
}>(), {
    size: 'icon-sm',
});

const delegatedProps = reactiveOmit(props, 'class', 'size');

const { t } = useI18n();
</script>

<template>
    <PaginationLast data-slot="pagination-last" :aria-label="t('uiVintage.pagination.last')" v-bind="delegatedProps" :class="cn(buttonVariants({ variant: 'secondary', size: props.size }), 'group/pagination-nav', props.class)">
        <slot>
            <HugeiconsIcon :icon="ArrowRightDoubleIcon" class="size-4 transition-transform duration-220 ease-spring group-hover/pagination-nav:translate-x-0.5" aria-hidden="true" />
        </slot>
    </PaginationLast>
</template>