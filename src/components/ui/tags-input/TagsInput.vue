<script setup lang="ts" generic="T extends AcceptableInputValue = string">
import type { AcceptableInputValue, TagsInputRootEmits, TagsInputRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { TagsInputRoot, useForwardPropsEmits } from 'reka-ui';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';
import TagsInputInput from './TagsInputInput.vue';
import TagsInputItem from './TagsInputItem.vue';

// Props
const props = defineProps<TagsInputRootProps<T> & {
    placeholder?: string;
    class?: HTMLAttributes['class'];
    inputClass?: HTMLAttributes['class'];
}>();

// Emits
const emits = defineEmits<TagsInputRootEmits<T>>();

const delegatedProps = reactiveOmit(props, 'class', 'inputClass', 'placeholder');
const forwarded = useForwardPropsEmits(delegatedProps, emits);

const { t } = useI18n();
const resolvedPlaceholder = computed(() => props.placeholder ?? t('uiVintage.tagsInput.placeholder'));

// Stable key per tag (falls back to the index when duplicates are allowed)
const getItemKey = (item: AcceptableInputValue, index: number) => {
    if (props.duplicate) return index;
    return typeof item === 'object' ? JSON.stringify(item) : String(item);
};
</script>

<template>
    <TagsInputRoot v-slot="slotProps" data-slot="tags-input" v-bind="forwarded" :class="cn(
        'uv-field flex min-h-13 w-full flex-wrap items-center gap-2 rounded border border-input bg-secondary px-3 py-2 text-xs font-semibold text-foreground shadow-elevated-sm sm:text-sm',
        'data-disabled:cursor-not-allowed data-disabled:opacity-60 data-invalid:animate-uv-shake',
        props.class
    )">
        <slot v-bind="slotProps">
            <!-- Auto-rendered tags -->
            <TagsInputItem v-for="(item, index) in slotProps.modelValue" :key="getItemKey(item, index)" :value="item" />

            <!-- Text input -->
            <TagsInputInput :placeholder="resolvedPlaceholder" :class="props.inputClass" />
        </slot>
    </TagsInputRoot>
</template>