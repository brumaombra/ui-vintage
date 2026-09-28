<script setup lang="ts">
import type { PinInputInputProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { computed, inject } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { injectPinInputRootContext, PinInputInput, useForwardProps } from 'reka-ui';
import { cn } from '../../../lib/utils';
import { pinInputContextKey } from './context';

defineOptions({ inheritAttrs: false });

// Props
const props = defineProps<PinInputInputProps & {
    class?: HTMLAttributes['class'];
}>();

const delegatedProps = reactiveOmit(props, 'class');
const forwardedProps = useForwardProps(delegatedProps);

const rootContext = injectPinInputRootContext();
const pinInputContext = inject(pinInputContextKey, null);

// Current character of this cell
const cellValue = computed(() => {
    const value = rootContext.currentModelValue.value[props.index];
    return value === undefined || value === null ? '' : String(value);
});
const isFilled = computed(() => cellValue.value !== '');
const displayValue = computed(() => (rootContext.mask.value ? '•' : cellValue.value));
const isInvalid = computed(() => pinInputContext?.invalid.value || undefined);
</script>

<template>
    <span data-slot="pin-input-cell" class="relative inline-flex shrink-0">
        <!-- Native input (text is transparent, the overlay below renders the character) -->
        <PinInputInput data-slot="pin-input-input" v-bind="{ ...$attrs, ...forwardedProps }" :aria-invalid="isInvalid" :data-filled="isFilled ? '' : undefined" :class="cn(
            'uv-field size-12 rounded border border-input bg-secondary text-center text-lg font-bold text-transparent caret-primary shadow-elevated-sm outline-none sm:size-13',
            'placeholder:text-muted-foreground placeholder:opacity-50 selection:bg-primary/25',
            'data-filled:border-primary/60 data-filled:bg-primary/5',
            'disabled:cursor-not-allowed disabled:opacity-60',
            props.class
        )" />

        <!-- Animated character (re-keyed on every value so it pops) -->
        <span v-if="isFilled" :key="cellValue" aria-hidden="true" class="pointer-events-none absolute inset-0 flex animate-uv-pop items-center justify-center text-lg font-bold text-foreground">
            {{ displayValue }}
        </span>
    </span>
</template>