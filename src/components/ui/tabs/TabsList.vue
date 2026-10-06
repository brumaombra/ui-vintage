<script setup lang="ts">
import type { TabsListProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { TabsIndicator, TabsList } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<TabsListProps & {
    class?: HTMLAttributes['class'];
    indicatorClass?: HTMLAttributes['class'];
}>();

const delegatedProps = reactiveOmit(props, 'class', 'indicatorClass');
</script>

<template>
    <TabsList data-slot="tabs-list" v-bind="delegatedProps" :class="cn(
        'group/tabs-list relative isolate inline-flex h-auto w-fit items-center justify-center gap-1 rounded border border-border bg-card p-1 text-card-foreground shadow-elevated-sm aria-[orientation=vertical]:flex-col aria-[orientation=vertical]:items-stretch',
        props.class
    )">
        <!-- Sliding active indicator -->
        <TabsIndicator data-slot="tabs-indicator" :class="cn(
            'absolute -z-10 rounded border border-primary/40 bg-primary/10 transition-[translate,width,height] duration-[380ms] ease-spring',
            'group-aria-[orientation=horizontal]/tabs-list:inset-y-1 group-aria-[orientation=horizontal]/tabs-list:left-0 group-aria-[orientation=horizontal]/tabs-list:w-(--reka-tabs-indicator-size) group-aria-[orientation=horizontal]/tabs-list:translate-x-(--reka-tabs-indicator-position)',
            'group-aria-[orientation=vertical]/tabs-list:inset-x-1 group-aria-[orientation=vertical]/tabs-list:top-0 group-aria-[orientation=vertical]/tabs-list:h-(--reka-tabs-indicator-size) group-aria-[orientation=vertical]/tabs-list:translate-y-(--reka-tabs-indicator-position)',
            props.indicatorClass
        )" />

        <slot />
    </TabsList>
</template>