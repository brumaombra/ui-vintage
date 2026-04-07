<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

interface SkeletonProps {
  class?: HTMLAttributes["class"]
}

const props = defineProps<SkeletonProps>()
</script>

<template>
  <div data-slot="skeleton" :class="cn(props.class, 'animate-pulse rounded border border-(--border-light) bg-(--bg-surface-light) transition-colors duration-300 ease-in-out dark:border-(--border-dark) dark:bg-(--bg-surface-dark)',)" />
</template>
