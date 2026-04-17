<script setup lang="ts">
import { computed } from "vue"
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

type CardTheme = "default" | "gray" | "green" | "red" | "blue" | "yellow"

const props = defineProps<{
  theme?: CardTheme
  class?: HTMLAttributes["class"]
}>()

const themeClasses = computed(() => {
  switch (props.theme) {
    case "gray":
      return "border border-[var(--border-light)] bg-gray-50 text-[var(--text-primary-light)] dark:border-[var(--border-dark)] dark:bg-[var(--bg-card-dark)] dark:text-[var(--text-primary-dark)]"
    case "green":
      return "border border-green-200 bg-green-50 text-green-700 dark:border-green-800/50 dark:bg-green-900/10 dark:text-green-400"
    case "red":
      return "border border-red-200 bg-red-50 text-red-700 dark:border-red-800/50 dark:bg-red-900/10 dark:text-red-400"
    case "blue":
      return "border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/50 dark:bg-blue-900/10 dark:text-blue-400"
    case "yellow":
      return "border border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800/50 dark:bg-yellow-900/10 dark:text-yellow-400"
    default:
      return "border border-border bg-card text-card-foreground"
  }
})
</script>

<template>
  <div data-slot="card" :class="cn(
    'flex flex-col gap-6 rounded py-6 transition-colors duration-300 ease-in-out',
    themeClasses,
    props.class,
  )
    ">
    <slot />
  </div>
</template>