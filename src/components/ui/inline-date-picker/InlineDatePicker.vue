<script setup lang="ts">
import type { DateValue } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { fromDate, getLocalTimeZone, toCalendarDate, today } from '@internationalized/date';
import { computed, shallowRef, watch } from 'vue';
import { Calendar } from '../calendar';

// Props (the day as a Date at midnight of the visitor's time zone, the days before minDate or after maxDate can't be picked)
const props = withDefaults(defineProps<{
	modelValue?: Date | null;
	minDate?: Date | null;
	maxDate?: Date | null;
	locale?: string;
	class?: HTMLAttributes['class'];
}>(), {
	modelValue: null,
	minDate: null,
	maxDate: null,
	locale: undefined
});

// Emits
const emits = defineEmits<{
	(e: 'update:modelValue', payload: Date | null): void;
}>();

const localTimeZone = getLocalTimeZone();

// A Date as a day of the calendar (none for a missing or invalid date)
const toCalendarValue = (date: Date | null | undefined): DateValue | undefined => {
	if (!(date instanceof Date) || Number.isNaN(date.getTime())) return undefined;
	return toCalendarDate(fromDate(date, localTimeZone));
};

// The picked day, and the limits
const calendarValue = computed(() => toCalendarValue(props.modelValue));
const minValue = computed(() => toCalendarValue(props.minDate));
const maxValue = computed(() => toCalendarValue(props.maxDate));

// The month shown: the picked day's (also when it is picked from outside, e.g. a quick pick in the next month), today's when there is none
const placeholder = shallowRef<DateValue>(calendarValue.value ?? minValue.value ?? today(localTimeZone));
watch(calendarValue, value => {
	if (value) placeholder.value = value;
});

// Pick a day (a Date at midnight of that day)
const handlePick = (value: DateValue | undefined) => {
	emits('update:modelValue', value ? new Date(value.year, value.month - 1, value.day) : null);
};
</script>

<template>
	<!-- An always open calendar, its days filling the width -->
	<div data-slot="inline-date-picker" :class="props.class">
		<Calendar :model-value="calendarValue" :placeholder="placeholder" :min-value="minValue" :max-value="maxValue" :locale="props.locale" fluid weekday-format="narrow" class="p-0" @update:model-value="handlePick" @update:placeholder="value => placeholder = value" />
	</div>
</template>