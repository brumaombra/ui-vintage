<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

const props = withDefaults(defineProps<{
    defaultValue?: string
    modelValue?: string
    step?: string | number
    min?: string
    max?: string
    disabled?: boolean
    class?: HTMLAttributes['class']
    inputClass?: HTMLAttributes['class']
}>(), {
    defaultValue: '',
    step: 1,
    disabled: false,
})

const emits = defineEmits<{
    (e: 'update:modelValue', payload: string): void
}>()

const internalValue = ref(props.defaultValue)
const isControlled = computed(() => props.modelValue !== undefined)

const time = computed({
    get: () => (isControlled.value ? props.modelValue : internalValue.value) ?? '',
    set: (value: string | number) => {
        const nextValue = String(value)

        if (!isControlled.value)
            internalValue.value = nextValue

        emits('update:modelValue', nextValue)
    },
})
</script>

<template>
    <Input
        v-model="time"
        type="time"
        :step="props.step"
        :min="props.min"
        :max="props.max"
        :disabled="props.disabled"
        :class="cn(
            'cursor-pointer font-normal hover:border-(--border-hover-light) hover:bg-(--bg-selected-light) dark:hover:border-(--border-hover-dark) dark:hover:bg-(--bg-selected-dark) [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100',
            props.inputClass,
            props.class,
        )"
    />
</template>