<script lang="ts" setup>
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <table
    data-slot="data-list"
    :class="cn('w-full text-left text-xs md:text-sm', props.class)"
  >
    <tbody class="border-y border-border">
      <slot />
    </tbody>
  </table>
</template>