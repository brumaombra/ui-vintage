<script setup lang="ts">
import type { ListboxContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ListboxContent, useForwardProps } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<ListboxContentProps & { class?: HTMLAttributes['class'] }>();

// Omit local class from delegated props
const delegatedProps = reactiveOmit(props, 'class');

// Forward props
const forwarded = useForwardProps(delegatedProps);
</script>

<template>
    <ListboxContent data-slot="command-list" v-bind="forwarded" :class="cn(
        'max-h-75 scroll-py-1 overflow-x-hidden overflow-y-auto',
        props.class,
    )
        ">
        <div role="presentation">
            <slot />
        </div>
    </ListboxContent>
</template>