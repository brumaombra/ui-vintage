<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import type { SelectValueProps } from "reka-ui"
import { computed, useSlots } from "vue"
import { SelectValue } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<SelectValueProps & {
  class?: HTMLAttributes["class"]
  iconClass?: HTMLAttributes["class"]
  textClass?: HTMLAttributes["class"]
  descriptionClass?: HTMLAttributes["class"]
}>()

const getSlots = useSlots

const hasDescription = computed(() => Boolean(getSlots().description))
</script>

<template>
  <SelectValue data-slot="select-value-content" :placeholder="props.placeholder" :class="cn('flex min-w-0 flex-1 gap-2 text-left', hasDescription ? 'items-start' : 'items-center', props.class)">
    <div v-if="$slots.icon" data-slot="select-value-content-icon" :class="cn('shrink-0', props.iconClass)">
      <slot name="icon" />
    </div>

    <div class="flex min-w-0 flex-1 flex-col">
      <span data-slot="select-value-content-text" :class="cn('min-w-0 truncate', props.textClass)">
        <slot name="text">
          <slot />
        </slot>
      </span>

      <span v-if="$slots.description" data-slot="select-value-content-description" :class="cn('text-xs text-(--text-secondary-light) dark:text-(--text-secondary-dark)', props.descriptionClass)">
        <slot name="description" />
      </span>
    </div>
  </SelectValue>
</template>