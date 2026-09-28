<script setup lang="ts">
import type { ComboboxInputEmits, ComboboxInputProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ComboboxInput, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';

defineOptions({
    inheritAttrs: false
});

// Props
const props = defineProps<ComboboxInputProps & { class?: HTMLAttributes['class'] }>();

// Emits
const emits = defineEmits<ComboboxInputEmits>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <ComboboxInput data-slot="combobox-input" v-bind="{ ...$attrs, ...forwarded }" :class="cn(
        'h-9 min-w-16 flex-1 truncate bg-transparent font-semibold text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
        props.class
    )
        " />
</template>