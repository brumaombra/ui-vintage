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
        'text-muted-foreground hover:text-foreground focus-visible:outline-none inline-flex min-h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded border border-transparent bg-transparent px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors duration-300 ease-in-out disabled:pointer-events-none disabled:opacity-50 data-[state=active]:cursor-pointer data-[state=active]:border-(--button-primary-light) data-[state=active]:bg-gray-50 data-[state=active]:text-(--button-primary-light) data-[state=active]:font-semibold data-[state=active]:outline-1 data-[state=active]:outline-border data-[state=active]:outline-offset-0 data-[state=active]:shadow-none dark:data-[state=active]:border-(--button-primary-dark) dark:data-[state=active]:bg-(--bg-card-dark) dark:data-[state=active]:text-(--button-primary-dark) [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        props.class
    )
        " v-bind="forwardedProps">
        <slot />
    </TabsTrigger>
</template>