<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div data-slot="alert-dialog-footer" :class="cn(
    'flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row-reverse sm:px-6',
    props.class,
  )
    ">
    <slot />
  </div>
</template>
