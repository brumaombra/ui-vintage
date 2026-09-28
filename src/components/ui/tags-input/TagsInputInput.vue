<script setup lang="ts">
import type { TagsInputInputProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { TagsInputInput, useForwardProps } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<TagsInputInputProps & {
    class?: HTMLAttributes['class'];
}>();

const delegatedProps = reactiveOmit(props, 'class');
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
    <TagsInputInput data-slot="tags-input-input" v-bind="forwardedProps" :class="cn(
        'h-7 min-w-24 flex-1 bg-transparent px-1 text-xs font-semibold text-foreground outline-none sm:text-sm',
        'placeholder:text-muted-foreground placeholder:opacity-60 disabled:cursor-not-allowed',
        props.class
    )" />
</template>