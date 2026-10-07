<script setup lang="ts">
import type { ListboxGroupProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ListboxGroup, ListboxGroupLabel, useId } from 'reka-ui';
import { computed, onMounted, onUnmounted } from 'vue';
import { cn } from '../../../lib/utils';
import { provideCommandGroupContext, useCommand } from '.';

// Props
const props = defineProps<ListboxGroupProps & {
    class?: HTMLAttributes['class'];
    heading?: string;
    stagger?: boolean;
}>();

// Omit local props from delegated props
const delegatedProps = reactiveOmit(props, 'class', 'stagger');

// Items float in one after another when the group mounts (same timing as the dropdown menu)
const staggerClass = [
    '[&>*]:animate-[uv-float-in_240ms_var(--ease-out-expo)_both] [&>*]:[--uv-float-offset:-3px]',
    '[&>*:nth-child(2)]:[animation-delay:16ms]',
    '[&>*:nth-child(3)]:[animation-delay:32ms]',
    '[&>*:nth-child(4)]:[animation-delay:48ms]',
    '[&>*:nth-child(5)]:[animation-delay:64ms]',
    '[&>*:nth-child(6)]:[animation-delay:80ms]',
    '[&>*:nth-child(7)]:[animation-delay:96ms]',
    '[&>*:nth-child(8)]:[animation-delay:112ms]',
    '[&>*:nth-child(n+9)]:[animation-delay:128ms]'
].join(' ');

const { allGroups, filterState } = useCommand();
const id = useId();

const isRender = computed(() =>
    !filterState.search ? true : filterState.filtered.groups.has(id),
);

provideCommandGroupContext({ id });
onMounted(() => {
    if (!allGroups.value.has(id)) allGroups.value.set(id, new Set());
});
onUnmounted(() => {
    allGroups.value.delete(id);
});
</script>

<template>
    <ListboxGroup v-bind="delegatedProps" :id="id" data-slot="command-group" :class="cn('text-foreground overflow-hidden', props.class)" :hidden="isRender ? undefined : true">
        <ListboxGroupLabel v-if="heading" data-slot="command-group-heading" class="border-b border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {{ heading }}
        </ListboxGroupLabel>
        <div :class="cn('p-2', props.stagger && staggerClass)">
            <slot />
        </div>
    </ListboxGroup>
</template>