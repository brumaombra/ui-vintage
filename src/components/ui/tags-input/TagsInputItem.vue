<script setup lang="ts">
import type { TagsInputItemProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { TagsInputItem, useForwardProps } from 'reka-ui';
import { cn } from '../../../lib/utils';
import TagsInputItemDelete from './TagsInputItemDelete.vue';
import TagsInputItemText from './TagsInputItemText.vue';

// Props
const props = defineProps<TagsInputItemProps & {
    class?: HTMLAttributes['class'];
}>();

const delegatedProps = reactiveOmit(props, 'class');
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
    <TagsInputItem data-slot="tags-input-item" v-bind="forwardedProps" :class="cn(
        'group/tag inline-flex h-7 max-w-full animate-uv-pop items-center gap-1.5 rounded border border-border bg-surface py-1 pr-1 pl-2.5 text-xs font-semibold text-foreground outline-none',
        'transition-[border-color,background-color,box-shadow] duration-150 ease-snappy',
        'data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:ring-[3px] data-[state=active]:ring-primary/15',
        'data-disabled:opacity-60',
        props.class
    )">
        <slot>
            <!-- Tag text -->
            <TagsInputItemText />

            <!-- Delete button -->
            <TagsInputItemDelete />
        </slot>
    </TagsInputItem>
</template>