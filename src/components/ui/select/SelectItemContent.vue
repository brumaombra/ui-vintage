<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { useSlots } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  iconClass?: HTMLAttributes["class"]
  textClass?: HTMLAttributes["class"]
  descriptionClass?: HTMLAttributes["class"]
}>()

const slots = useSlots()
</script>

<template>
  <div data-slot="select-item-content" :class="cn('flex min-w-0 flex-1 items-start gap-2', props.class)">
    <div v-if="slots.icon" data-slot="select-item-content-icon" :class="cn('mt-0.5 shrink-0', props.iconClass)">
      <slot name="icon" />
    </div>

    <div class="flex min-w-0 flex-1 flex-col">
      <span data-slot="select-item-content-text" :class="cn('min-w-0 truncate', props.textClass)">
        <slot name="text">
          <slot />
        </slot>
      </span>

      <span v-if="slots.description" data-slot="select-item-content-description" :class="cn('text-xs text-(--text-secondary-light) dark:text-(--text-secondary-dark)', props.descriptionClass)">
        <slot name="description" />
      </span>
    </div>
  </div>
</template>