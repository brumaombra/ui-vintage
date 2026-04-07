<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { DateFormatter, getLocalTimeZone, today } from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import type { DateValue } from 'reka-ui'
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

const props = withDefaults(defineProps<{
    defaultValue?: DateValue
    modelValue?: DateValue
    placeholder?: string
    disabled?: boolean
    class?: HTMLAttributes['class']
    contentClass?: HTMLAttributes['class']
}>(), {
    placeholder: 'Pick a date',
    disabled: false,
})

const emits = defineEmits<{
    (e: 'update:modelValue', payload: DateValue | undefined): void
}>()

const internalDate = ref<DateValue | undefined>(props.defaultValue)
const isControlled = computed(() => props.modelValue !== undefined)

const date = computed({
    get: () => (isControlled.value ? props.modelValue : internalDate.value) as any,
    set: (value: DateValue | undefined) => {
        if (!isControlled.value)
            internalDate.value = value

        emits('update:modelValue', value)
    },
})

const defaultPlaceholder = computed(() => (date.value ?? today(getLocalTimeZone())) as any)

const formatter = new DateFormatter('en-US', {
    dateStyle: 'long',
})
</script>

<template>
    <Popover v-slot="{ close }">
        <PopoverTrigger as-child>
            <Button variant="outline" :disabled="disabled" :class="cn('w-[240px] justify-start text-left font-normal', !date && 'text-muted-foreground', props.class)">
                <CalendarIcon class="size-4" />
                {{ date ? formatter.format(date.toDate(getLocalTimeZone())) : placeholder }}
            </Button>
        </PopoverTrigger>
        <PopoverContent :class="cn('w-auto p-0', props.contentClass)" align="start">
            <Calendar v-model="date" :default-placeholder="defaultPlaceholder" layout="month-and-year" initial-focus @update:model-value="close" />
        </PopoverContent>
    </Popover>
</template>