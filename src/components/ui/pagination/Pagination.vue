<script setup lang="ts">
import type { PaginationRootEmits, PaginationRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { PaginationRoot, useForwardPropsEmits } from 'reka-ui';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<PaginationRootProps & {
    class?: HTMLAttributes['class'];
}>();

// Emits
const emits = defineEmits<PaginationRootEmits>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);

const { t } = useI18n();
</script>

<template>
    <PaginationRoot v-slot="slotProps" data-slot="pagination" :aria-label="t('uiVintage.pagination.label')" v-bind="forwarded" :class="cn('mx-auto flex w-full justify-center', props.class)">
        <slot v-bind="slotProps" />
    </PaginationRoot>
</template>