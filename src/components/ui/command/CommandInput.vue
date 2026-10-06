<script setup lang="ts">
import type { ListboxFilterProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { ListboxFilter, useForwardProps } from 'reka-ui';
import { cn } from '../../../lib/utils';
import { useCommand } from '.';

defineOptions({
    inheritAttrs: false,
});

// Props
const props = defineProps<ListboxFilterProps & { class?: HTMLAttributes['class'] }>();

// Omit local class from delegated props
const delegatedProps = reactiveOmit(props, 'class');

const forwardedProps = useForwardProps(delegatedProps);

const { filterState } = useCommand();
</script>

<template>
    <div data-slot="command-input-wrapper" class="flex h-12 items-center gap-3 border-b border-border px-4">
        <HugeiconsIcon :icon="Search01Icon" class="size-4 shrink-0 text-muted-foreground" />
        <ListboxFilter v-bind="{ ...forwardedProps, ...$attrs }" v-model="filterState.search" data-slot="command-input" auto-focus :class="cn(
            'placeholder:text-muted-foreground flex h-10 w-full rounded bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
            props.class,
        )
            " />
    </div>
</template>