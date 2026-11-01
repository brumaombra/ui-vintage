<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed, ref } from 'vue';
import Calendar03Icon from '@hugeicons/core-free-icons/Calendar03Icon';
import { useI18n } from 'vue-i18n';
import { InlineDatePicker } from '../inline-date-picker';
import PickerShell from './PickerShell.vue';

// Props (the date as a Date at midnight, the days offered between minDate and maxDate)
const props = withDefaults(defineProps<{
	defaultValue?: Date | null;
	modelValue?: Date | null;
	minDate?: Date | null;
	maxDate?: Date | null;
	placeholder?: string;
	disabled?: boolean;
	class?: HTMLAttributes['class'];
	contentClass?: HTMLAttributes['class'];
}>(), {
	defaultValue: null,
	modelValue: undefined,
	minDate: null,
	maxDate: null,
	disabled: false
});

// Emits
const emits = defineEmits<{
	(e: 'update:modelValue', payload: Date | null): void;
}>();

const { t, locale } = useI18n();
const isOpen = ref(false);
const internalDate = ref<Date | null>(props.defaultValue);

// The date picked (from v-model, or kept inside when the picker is used without it)
const date = computed({
	get: () => (props.modelValue !== undefined ? props.modelValue : internalDate.value),
	set: (value: Date | null) => {
		internalDate.value = value;
		emits('update:modelValue', value);
	}
});

// The date in words, in the language of the page
const valueText = computed(() => (date.value ? date.value.toLocaleDateString(locale.value, { day: 'numeric', month: 'long', year: 'numeric' }) : ''));
const resolvedPlaceholder = computed(() => props.placeholder || t('uiVintage.datePicker.placeholder'));

// Pick a day: the picker closes at once
const pickDate = (value: Date | null) => {
	date.value = value;
	isOpen.value = false;
};
</script>

<template>
	<PickerShell v-model:open="isOpen" :value-text="valueText" :placeholder="resolvedPlaceholder" :title="resolvedPlaceholder" :icon="Calendar03Icon" :disabled="props.disabled" :class="props.class" :content-class="props.contentClass">
		<InlineDatePicker :model-value="date" :min-date="props.minDate" :max-date="props.maxDate" :locale="locale" @update:model-value="pickDate" />
	</PickerShell>
</template>