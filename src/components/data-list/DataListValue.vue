<script lang="ts" setup>
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <td
    data-slot="data-list-value"
    :class="cn('py-3 pl-2 align-top text-right font-medium text-foreground', props.class)"
  >
    <slot />
  </td>
</template>