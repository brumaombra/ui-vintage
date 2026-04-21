<script lang="ts" setup>
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="data-list-text"
    :class="cn('line-clamp-3', props.class)"
  >
    <slot />
  </div>
</template>