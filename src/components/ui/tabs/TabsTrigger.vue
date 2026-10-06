<script setup lang="ts">
import type { TabsTriggerProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { TabsTrigger, useForwardProps } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<TabsTriggerProps & {
    class?: HTMLAttributes['class'];
}>();

const delegatedProps = reactiveOmit(props, 'class');
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
    <TabsTrigger data-slot="tabs-trigger" :class="cn(
        'relative inline-flex min-h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded border border-transparent bg-transparent px-4 py-2 text-sm font-semibold whitespace-nowrap text-muted-foreground outline-none select-none',
        '[transition:color_150ms,background-color_150ms,scale_300ms_var(--ease-spring)] hover:text-foreground active:scale-[0.97] focus-visible:ring-[3px] focus-visible:ring-ring/45 disabled:pointer-events-none disabled:opacity-50',
        'data-[state=active]:text-primary data-[state=inactive]:hover:bg-accent/60',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        props.class
    )" v-bind="forwardedProps">
        <slot />
    </TabsTrigger>
</template>