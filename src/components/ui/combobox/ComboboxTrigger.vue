<script setup lang="ts">
import type { ComboboxTriggerProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { ComboboxTrigger, useForwardProps } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<ComboboxTriggerProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
    <ComboboxTrigger data-slot="combobox-trigger" v-bind="forwardedProps" :class="cn(
        'group/combobox-trigger -mr-1 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors duration-150 hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60',
        props.class
    )
        ">
        <slot>
            <!-- Chevron rotates with a spring while open -->
            <HugeiconsIcon :icon="ArrowDown01Icon" class="size-4 text-current transition-transform duration-300 ease-spring group-data-[state=open]/combobox-trigger:rotate-180" />
        </slot>
    </ComboboxTrigger>
</template>