<script setup lang="ts">
import type { ComboboxEmptyProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ComboboxEmpty } from 'reka-ui';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<ComboboxEmptyProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');

const { t } = useI18n();
</script>

<template>
    <ComboboxEmpty data-slot="combobox-empty" v-bind="delegatedProps" :class="cn('animate-uv-fade-up px-3 py-6 text-center text-xs font-semibold text-muted-foreground sm:text-sm', props.class)">
        <slot>{{ t('uiVintage.combobox.empty') }}</slot>
    </ComboboxEmpty>
</template>