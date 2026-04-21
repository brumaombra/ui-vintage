<script lang="ts" setup>
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <td
    data-slot="data-list-label"
    :class="cn('py-3 align-top text-muted-foreground', props.class)"
  >
    <slot />
  </td>
</template>