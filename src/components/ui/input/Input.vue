<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { useVModel } from '@vueuse/core';
import { cn } from '../../../lib/utils';
import { useFieldControlId } from '../field/field-context';

// Props
const props = defineProps<{
    defaultValue?: string | number;
    modelValue?: string | number;
    class?: HTMLAttributes['class'];
}>();

// Emits
const emits = defineEmits<{
    (e: 'update:modelValue', payload: string | number): void;
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue
});

// Let a surrounding Field label point to this control
const fieldControlId = useFieldControlId();
</script>

<template>
    <input :id="fieldControlId" v-model="modelValue" data-slot="input" :class="cn(
        'uv-field h-13 w-full min-w-0 rounded border border-input bg-secondary px-4 py-3 text-xs font-semibold text-foreground shadow-elevated-sm outline-none sm:text-sm',
        'selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground placeholder:opacity-60 placeholder:transition-opacity focus-visible:placeholder:opacity-40',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-foreground',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:animate-uv-shake',
        props.class
    )" />
</template>