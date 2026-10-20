<script setup lang="ts">
import { computed, ref, useSlots, type HTMLAttributes } from 'vue';
import { useElementSize, useVModel } from '@vueuse/core';
import { cn } from '../../../lib/utils';
import { useFieldControlId } from '../field/field-context';

defineOptions({
	inheritAttrs: false
});

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

// Field look, shared by the plain input and the one with a suffix
const inputClasses = computed(() => cn(
	'uv-field h-13 w-full min-w-0 rounded border border-input bg-secondary px-4 py-3 text-xs font-semibold text-foreground shadow-elevated-sm outline-none sm:text-sm',
	'selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground placeholder:opacity-60 placeholder:transition-opacity focus-visible:placeholder:opacity-40',
	'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-foreground',
	'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:animate-uv-shake',
	props.class
));

// Optional suffix inside the field (like a unit): the text never runs under it
const slots = useSlots();
const suffixRef = ref<HTMLElement | null>(null);
const { width: suffixWidth } = useElementSize(suffixRef);
const suffixPadding = computed(() => slots.suffix && suffixWidth.value ? { paddingRight: `calc(${suffixWidth.value}px + 1.75rem)` } : undefined);
</script>

<template>
	<div v-if="$slots.suffix" data-slot="input-group" class="relative w-full min-w-0">
		<input :id="fieldControlId" v-model="modelValue" data-slot="input" v-bind="$attrs" :style="suffixPadding" :class="inputClasses" />

		<!-- Suffix -->
		<span ref="suffixRef" data-slot="input-suffix" class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-semibold text-muted-foreground sm:text-sm">
			<slot name="suffix" />
		</span>
	</div>
	<input v-else :id="fieldControlId" v-model="modelValue" data-slot="input" v-bind="$attrs" :class="inputClasses" />
</template>