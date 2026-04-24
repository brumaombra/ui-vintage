<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { getSurfaceToneClasses } from "@/lib/color-tokens"
import { cn } from "@/lib/utils"
import { alertClasses, type AlertColors } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  color?: AlertColors["color"]
}>()
</script>

<template>
  <div data-slot="alert" role="alert" :class="cn(alertClasses(), getSurfaceToneClasses(props.color ?? 'gray'), props.class)">
    <slot />
  </div>
</template>