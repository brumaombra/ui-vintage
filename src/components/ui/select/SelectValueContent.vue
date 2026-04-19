<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue"
import type { SelectValueProps } from "reka-ui"
import { SelectValue } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<SelectValueProps & {
  class?: HTMLAttributes["class"]
  icon?: Component | null
  label?: string | number | null
  description?: string | number | null
  iconClass?: HTMLAttributes["class"]
  textClass?: HTMLAttributes["class"]
  descriptionClass?: HTMLAttributes["class"]
}>()
</script>

<template>
  <SelectValue data-slot="select-value-content" :placeholder="props.placeholder" :class="cn('flex min-w-0 flex-1 gap-2 text-left', props.description ? 'items-start' : 'items-center', props.class)">
    <div v-if="props.icon" data-slot="select-value-content-icon" :class="cn('shrink-0', props.iconClass)">
      <component :is="props.icon" />
    </div>

    <div class="flex min-w-0 flex-1 flex-col">
      <span data-slot="select-value-content-text" :class="cn('min-w-0 truncate', props.textClass)">
        {{ props.label }}
      </span>

      <span v-if="props.description" data-slot="select-value-content-description" :class="cn('text-xs text-(--text-secondary-light) dark:text-(--text-secondary-dark)', props.descriptionClass)">
        {{ props.description }}
      </span>
    </div>
  </SelectValue>
</template>