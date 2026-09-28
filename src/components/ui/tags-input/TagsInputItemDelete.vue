<script setup lang="ts">
import type { TagsInputItemDeleteProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { TagsInputItemDelete, useForwardProps } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<TagsInputItemDeleteProps & {
    class?: HTMLAttributes['class'];
}>();

const delegatedProps = reactiveOmit(props, 'class');
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
    <TagsInputItemDelete data-slot="tags-input-item-delete" v-bind="forwardedProps" :class="cn(
        'inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground outline-none',
        '[transition:rotate_320ms_var(--ease-spring),scale_320ms_var(--ease-spring),background-color_150ms_var(--ease-snappy),color_150ms_var(--ease-snappy)]',
        'hover:rotate-90 hover:bg-accent hover:text-foreground active:scale-[0.8] focus-visible:ring-[3px] focus-visible:ring-ring/45',
        'group-data-[state=active]/tag:text-primary data-disabled:pointer-events-none',
        props.class
    )">
        <slot>
            <HugeiconsIcon :icon="Cancel01Icon" class="size-3" />
        </slot>
    </TagsInputItemDelete>
</template>