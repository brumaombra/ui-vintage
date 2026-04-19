<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { fromDate, getLocalTimeZone, toCalendarDate } from '@internationalized/date'
import type { DateValue } from 'reka-ui'
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { DatePicker } from '@/components/ui/date-picker'
import { TimePicker } from '@/components/ui/time-picker'

const props = withDefaults(defineProps<{
    defaultValue?: Date | null
    modelValue?: Date | null
    minDate?: Date | null
    maxDate?: Date | null
    step?: string | number
    disabled?: boolean
    datePlaceholder?: string
    class?: HTMLAttributes['class']
    datePickerClass?: HTMLAttributes['class']
    timePickerClass?: HTMLAttributes['class']
    datePickerContentClass?: HTMLAttributes['class']
}>(), {
    defaultValue: null,
    minDate: null,
    maxDate: null,
    step: 60,
    disabled: false,
    datePlaceholder: 'Pick a date',
})

const emits = defineEmits<{
    (e: 'update:modelValue', payload: Date | null): void
}>()

const localTimeZone = getLocalTimeZone()
const internalValue = ref<Date | null>(props.defaultValue)
const isControlled = computed(() => props.modelValue !== undefined)

const value = computed({
    get: () => (isControlled.value ? props.modelValue : internalValue.value) ?? null,
    set: (nextValue: Date | null) => {
        const resolvedValue = clampDate(nextValue)

        if (!isControlled.value)
            internalValue.value = resolvedValue

        emits('update:modelValue', resolvedValue)
    },
})

const toPickerDateValue = (date: Date | null | undefined): DateValue | undefined => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime()))
        return undefined

    return toCalendarDate(fromDate(date, localTimeZone))
}

const toTimeString = (date: Date | null | undefined) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime()))
        return ''

    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const buildDate = (dateValue: DateValue | undefined, timeValue: string) => {
    if (!dateValue)
        return null

    const [hours = '0', minutes = '0'] = (timeValue || '00:00').split(':')
    const nextDate = new Date(
        dateValue.year,
        dateValue.month - 1,
        dateValue.day,
        Number(hours),
        Number(minutes),
        0,
        0,
    )

    return Number.isNaN(nextDate.getTime()) ? null : nextDate
}

const areSameCalendarDay = (left: DateValue | undefined, right: DateValue | undefined) => {
    if (!left || !right)
        return false

    return left.year === right.year
        && left.month === right.month
        && left.day === right.day
}

const clampDate = (date: Date | null) => {
    if (!date)
        return null

    if (props.minDate && date.getTime() < props.minDate.getTime())
        return new Date(props.minDate)

    if (props.maxDate && date.getTime() > props.maxDate.getTime())
        return new Date(props.maxDate)

    return date
}

const getFallbackDate = () => value.value ?? props.minDate ?? props.maxDate ?? new Date()

const dateValue = computed({
    get: () => toPickerDateValue(value.value),
    set: (nextDateValue: DateValue | undefined) => {
        if (!nextDateValue) {
            value.value = null
            return
        }

        const fallbackTime = toTimeString(value.value ?? props.minDate ?? props.maxDate)
        value.value = buildDate(nextDateValue, fallbackTime)
    },
})

const timeValue = computed({
    get: () => toTimeString(value.value),
    set: (nextTimeValue: string) => {
        value.value = buildDate(toPickerDateValue(getFallbackDate()), nextTimeValue || toTimeString(getFallbackDate()))
    },
})

const minDateValue = computed(() => toPickerDateValue(props.minDate))
const maxDateValue = computed(() => toPickerDateValue(props.maxDate))

const minTimeValue = computed(() => {
    const selectedDate = dateValue.value
    const minimumDate = minDateValue.value

    return areSameCalendarDay(selectedDate, minimumDate) ? toTimeString(props.minDate) : undefined
})

const maxTimeValue = computed(() => {
    const selectedDate = dateValue.value
    const maximumDate = maxDateValue.value

    return areSameCalendarDay(selectedDate, maximumDate) ? toTimeString(props.maxDate) : undefined
})
</script>

<template>
    <div :class="cn('grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]', props.class)">
        <div>
            <DatePicker
                v-model="dateValue"
                :disabled="props.disabled"
                :placeholder="props.datePlaceholder"
                :min-value="minDateValue"
                :max-value="maxDateValue"
                :class="cn('w-full', props.datePickerClass)"
                :content-class="props.datePickerContentClass"
            />
        </div>

        <div>
            <TimePicker
                v-model="timeValue"
                :disabled="props.disabled"
                :step="props.step"
                :min="minTimeValue"
                :max="maxTimeValue"
                :class="cn('w-full', props.timePickerClass)"
            />
        </div>
    </div>
</template>