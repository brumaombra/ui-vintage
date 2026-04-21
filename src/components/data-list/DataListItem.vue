<script lang="ts" setup>
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <tr
    data-slot="data-list-item"
    :class="cn('border-b border-border last:border-b-0', props.class)"
  >
    <slot />
  </tr>
</template>