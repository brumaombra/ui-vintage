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
	size?: 'default' | 'sm';
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
	'uv-field w-full min-w-0 rounded border border-input bg-secondary px-4 py-3 text-xs font-semibold text-foreground shadow-elevated-sm outline-none sm:text-sm',
	props.size === 'sm' ? 'h-10 py-2' : 'h-13',
	'selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground placeholder:opacity-60 placeholder:transition-opacity focus-visible:placeholder:opacity-40',
	'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-foreground',
	'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:animate-uv-shake',
	props.class
));

// Optional prefix (like a search icon) and suffix (like a unit) inside the field: the text never runs under them
const slots = useSlots();
const prefixRef = ref<HTMLElement | null>(null);
const suffixRef = ref<HTMLElement | null>(null);
const { width: prefixWidth } = useElementSize(prefixRef);
const { width: suffixWidth } = useElementSize(suffixRef);
const affixPadding = computed(() => ({
	...(slots.prefix && prefixWidth.value ? { paddingLeft: `calc(${prefixWidth.value}px + 1.5rem)` } : {}),
	...(slots.suffix && suffixWidth.value ? { paddingRight: `calc(${suffixWidth.value}px + 1.75rem)` } : {})
}));
</script>

<template>
	<div v-if="$slots.prefix || $slots.suffix" data-slot="input-group" class="relative w-full min-w-0">
		<!-- Prefix -->
		<span v-if="$slots.prefix" ref="prefixRef" data-slot="input-prefix" class="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted-foreground [&_svg:not([class*='size-'])]:size-4">
			<slot name="prefix" />
		</span>

		<input :id="fieldControlId" v-model="modelValue" data-slot="input" v-bind="$attrs" :style="affixPadding" :class="inputClasses" />

		<!-- Suffix -->
		<span v-if="$slots.suffix" ref="suffixRef" data-slot="input-suffix" class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-semibold text-muted-foreground sm:text-sm">
			<slot name="suffix" />
		</span>
	</div>
	<input v-else :id="fieldControlId" v-model="modelValue" data-slot="input" v-bind="$attrs" :class="inputClasses" />
</template>