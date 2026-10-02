<script setup lang="ts">
import type { ListboxItemEmits, ListboxItemProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit, useCurrentElement } from '@vueuse/core';
import { ListboxItem, useForwardPropsEmits, useId } from 'reka-ui';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { cn } from '../../../lib/utils';
import { useCommand, useCommandGroup } from '.';

// Props
const props = defineProps<ListboxItemProps & { class?: HTMLAttributes['class'] }>();

// Emits
const emits = defineEmits<ListboxItemEmits>();

// Omit local class from delegated props
const delegatedProps = reactiveOmit(props, 'class');

// Forward props
const forwarded = useForwardPropsEmits(delegatedProps, emits);

const id = useId();
const { filterState, allItems, allGroups } = useCommand();
const groupContext = useCommandGroup();

const isRender = computed(() => {
    if (!filterState.search) {
        return true;
    } else {
        const filteredCurrentItem = filterState.filtered.items.get(id);
        // If the filtered items is undefined means not in the all times map yet
        // Do the first render to add into the map
        if (filteredCurrentItem === undefined) {
            return true;
        }

        // Check with filter
        return filteredCurrentItem > 0;
    }
});

const itemRef = ref();
const currentElement = useCurrentElement(itemRef);
onMounted(() => {
    if (!(currentElement.value instanceof HTMLElement)) return;

    // Index both the rendered text and a string value (used as extra search keywords)
    const keywords = typeof props.value === 'string' ? props.value : '';
    allItems.value.set(
        id,
        `${currentElement.value.textContent ?? ''} ${keywords}`.trim(),
    );

    const groupId = groupContext?.id;
    if (groupId) {
        if (!allGroups.value.has(groupId)) {
            allGroups.value.set(groupId, new Set([id]));
        } else {
            allGroups.value.get(groupId)?.add(id);
        }
    }
});
onUnmounted(() => {
    allItems.value.delete(id);
});
</script>

<template>
    <ListboxItem v-if="isRender" v-bind="forwarded" :id="id" ref="itemRef" data-slot="command-item" :class="cn(
        'relative flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-left text-sm font-semibold text-muted-foreground outline-hidden transition-colors duration-150 select-none data-highlighted:bg-accent data-highlighted:text-foreground data-[state=checked]:bg-accent data-[state=checked]:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
        'before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:scale-y-0 before:rounded-full before:bg-primary before:transition-transform before:duration-300 before:ease-spring data-highlighted:before:scale-y-100 data-[state=checked]:before:scale-y-100',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 [&_svg:not([class*=\'text-\'])]:text-current',
        props.class,
    )" @select="
            () => {
                filterState.search = '';
            }
        ">
        <slot />
    </ListboxItem>
</template>