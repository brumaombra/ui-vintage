<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { useVModel } from '@vueuse/core';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
    defaultValue?: string | number;
    modelValue?: string | number;
}>();

// Emits
const emits = defineEmits<{
    (e: 'update:modelValue', payload: string | number): void;
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue
});
</script>

<template>
    <textarea v-model="modelValue" data-slot="textarea" :class="cn(
        'uv-field flex field-sizing-content min-h-30 w-full min-w-0 rounded border border-input bg-secondary px-4 py-3 text-xs font-semibold text-foreground shadow-elevated-sm outline-none sm:text-sm',
        'selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground placeholder:opacity-60',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:animate-uv-shake',
        props.class
    )" />
</template>