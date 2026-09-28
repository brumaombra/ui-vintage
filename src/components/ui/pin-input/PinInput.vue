<script setup lang="ts" generic="Type extends 'text' | 'number' = 'text'">
import type { PinInputRootEmits, PinInputRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { computed, provide } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { PinInputRoot, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';
import { pinInputContextKey } from './context';
import PinInputInput from './PinInputInput.vue';

// Props
const props = defineProps<PinInputRootProps<Type> & {
    length?: number;
    invalid?: boolean;
    separatorAfter?: number;
    class?: HTMLAttributes['class'];
    inputClass?: HTMLAttributes['class'];
}>();

// Emits
const emits = defineEmits<PinInputRootEmits<Type>>();

const delegatedProps = reactiveOmit(props, 'class', 'inputClass', 'length', 'invalid', 'separatorAfter');
const forwarded = useForwardPropsEmits(delegatedProps, emits);

// Share the invalid state with the cells (also when they are passed through the slot)
provide(pinInputContextKey, {
    invalid: computed(() => !!props.invalid)
});
</script>

<template>
    <PinInputRoot v-slot="slotProps" data-slot="pin-input" v-bind="forwarded" :aria-invalid="props.invalid || undefined" :class="cn(
        'flex items-center gap-2 has-disabled:opacity-60',
        props.invalid && 'animate-uv-shake',
        props.class
    )">
        <slot v-bind="slotProps">
            <!-- Auto-rendered cells -->
            <template v-for="index in props.length ?? 0" :key="index">
                <PinInputInput :index="index - 1" :class="props.inputClass" />

                <!-- Separator -->
                <span v-if="props.separatorAfter === index - 1 && index < (props.length ?? 0)" data-slot="pin-input-separator" aria-hidden="true" class="mx-0.5 h-0.5 w-3 shrink-0 rounded-full bg-border-strong" />
            </template>
        </slot>
    </PinInputRoot>
</template>