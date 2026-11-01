<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed, ref } from 'vue';
import Calendar03Icon from '@hugeicons/core-free-icons/Calendar03Icon';
import CheckmarkCircle02Icon from '@hugeicons/core-free-icons/CheckmarkCircle02Icon';
import { HugeiconsIcon } from '@hugeicons/vue';
import { useI18n } from 'vue-i18n';
import { Button } from '../button';
import PickerShell from '../date-picker/PickerShell.vue';
import { InlineDatePicker } from '../inline-date-picker';
import { TimeWheel } from '../time-wheel';

// Props (the date and time as a Date, between minDate and maxDate, the minutes offered every minuteStep)
const props = withDefaults(defineProps<{
	defaultValue?: Date | null;
	modelValue?: Date | null;
	minDate?: Date | null;
	maxDate?: Date | null;
	minuteStep?: number;
	placeholder?: string;
	disabled?: boolean;
	class?: HTMLAttributes['class'];
	contentClass?: HTMLAttributes['class'];
}>(), {
	defaultValue: null,
	modelValue: undefined,
	minDate: null,
	maxDate: null,
	minuteStep: 5,
	disabled: false
});

// Emits
const emits = defineEmits<{
	(e: 'update:modelValue', payload: Date | null): void;
}>();

const { t, locale } = useI18n();
const isOpen = ref(false);
const internalValue = ref<Date | null>(props.defaultValue);

// The date and time picked (from v-model, or kept inside when the picker is used without it)
const value = computed({
	get: () => (props.modelValue !== undefined ? props.modelValue : internalValue.value),
	set: (next: Date | null) => {
		internalValue.value = next;
		emits('update:modelValue', next);
	}
});

// The pick while the picker is open, applied with confirm
const draftDay = ref<Date | null>(null);
const draftTime = ref('12:00');

// Write the time of a date ("18:05")
const toTimeString = (date: Date) => `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

// The day and the time of the pick as one date
const draftDate = computed(() => {
	if (!draftDay.value) return null;
	const [hours, minutes] = draftTime.value.split(':').map(Number);
	return new Date(draftDay.value.getFullYear(), draftDay.value.getMonth(), draftDay.value.getDate(), hours, minutes);
});

// The pick can be applied once it has a day, inside the bounds
const canConfirm = computed(() => {
	if (!draftDate.value) return false;
	if (props.minDate && draftDate.value < props.minDate) return false;
	if (props.maxDate && draftDate.value > props.maxDate) return false;
	return true;
});

// The value in words, in the language of the page
const valueText = computed(() => (value.value ? value.value.toLocaleString(locale.value, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''));
const resolvedPlaceholder = computed(() => props.placeholder || t('uiVintage.dateTimePicker.placeholder'));

// Open on a copy of the value (or no day and noon), so closing without confirm changes nothing
const handleOpen = (open: boolean) => {
	if (open) {
		draftDay.value = value.value ? new Date(value.value.getFullYear(), value.value.getMonth(), value.value.getDate()) : null;
		draftTime.value = value.value ? toTimeString(value.value) : '12:00';
	}
	isOpen.value = open;
};

// Apply the pick
const handleConfirm = () => {
	if (!canConfirm.value) return;
	value.value = draftDate.value;
	isOpen.value = false;
};
</script>

<template>
	<PickerShell :open="isOpen" :value-text="valueText" :placeholder="resolvedPlaceholder" :title="resolvedPlaceholder" :icon="Calendar03Icon" :disabled="props.disabled" :class="props.class" :content-class="['md:w-auto', props.contentClass]" @update:open="handleOpen">
		<!-- The day, then the time (side by side in the popover of larger screens) -->
		<div class="flex flex-col gap-3 md:flex-row md:items-center">
			<InlineDatePicker v-model="draftDay" :min-date="props.minDate" :max-date="props.maxDate" :locale="locale" class="md:w-72" />
			<TimeWheel v-model="draftTime" :minute-step="props.minuteStep" class="md:shrink-0" />
		</div>

		<!-- Apply the pick -->
		<template #footer>
			<Button variant="primary" :disabled="!canConfirm" @click="handleConfirm">
				<HugeiconsIcon :icon="CheckmarkCircle02Icon" class="size-4" aria-hidden="true" />
				{{ t('uiVintage.buttons.confirm') }}
			</Button>
		</template>
	</PickerShell>
</template>