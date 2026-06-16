<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "../../../lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div data-slot="sidebar-footer" data-sidebar="footer" :class="cn('flex flex-col gap-2 p-2 group-data-[compact=true]/sidebar-wrapper:gap-1.5 group-data-[compact=true]/sidebar-wrapper:p-2.5', props.class)">
    <slot />
  </div>
</template>
