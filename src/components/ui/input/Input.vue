<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { useVModel } from "@vueuse/core"
import { cn } from "@/lib/utils"

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes["class"]
}>()

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void
}>()

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <input v-model="modelValue" data-slot="input" :class="cn(
    'file:text-foreground selection:bg-primary selection:text-primary-foreground h-[52px] w-full min-w-0 rounded border border-(--border-light) bg-(--button-secondary-light) px-4 py-3 text-xs font-medium text-(--text-primary-light) outline-none transition-all duration-300 ease-in-out placeholder:text-(--text-secondary-light) placeholder:opacity-60 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-(--border-dark) dark:bg-(--button-secondary-dark) dark:text-(--text-primary-dark) dark:placeholder:text-(--text-secondary-dark) sm:text-sm',
    'focus-visible:border-(--border-hover-light) focus-visible:ring-0 dark:focus-visible:border-(--border-hover-dark)',
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
    props.class,
  )">
</template>
