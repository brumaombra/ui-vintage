<script setup lang="ts">
import type { PaginationNextProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ButtonVariants } from '../button';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { reactiveOmit } from '@vueuse/core';
import { PaginationNext } from 'reka-ui';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';
import { buttonVariants } from '../button';

// Props
const props = withDefaults(defineProps<PaginationNextProps & {
    size?: ButtonVariants['size'];
    class?: HTMLAttributes['class'];
}>(), {
    size: 'icon-sm',
});

const delegatedProps = reactiveOmit(props, 'class', 'size');

const { t } = useI18n();
</script>

<template>
    <PaginationNext data-slot="pagination-next" :aria-label="t('uiVintage.pagination.next')" v-bind="delegatedProps" :class="cn(buttonVariants({ variant: 'secondary', size: props.size }), 'group/pagination-nav', props.class)">
        <slot>
            <HugeiconsIcon :icon="ArrowRight01Icon" class="size-4 transition-transform duration-220 ease-spring group-hover/pagination-nav:translate-x-0.5" aria-hidden="true" />
        </slot>
    </PaginationNext>
</template>