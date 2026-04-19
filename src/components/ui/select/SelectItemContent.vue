<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { HugeiconsIcon } from "@hugeicons/vue"
import { cn } from "@/lib/utils"

type HugeiconsIconDefinition = readonly (readonly [string, { readonly [key: string]: string | number }])[]

const props = defineProps<{
  class?: HTMLAttributes["class"]
  icon?: HugeiconsIconDefinition | null
  label?: string | number | null
  description?: string | number | null
  iconClass?: HTMLAttributes["class"]
  textClass?: HTMLAttributes["class"]
  descriptionClass?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div data-slot="select-item-content" :class="cn('flex min-w-0 flex-1 items-start gap-2', props.class)">
    <div v-if="props.icon" data-slot="select-item-content-icon" :class="cn('mt-0.5 shrink-0', props.iconClass)">
      <HugeiconsIcon :icon="props.icon" :stroke-width="1.8" />
    </div>

    <div class="flex min-w-0 flex-1 flex-col">
      <span data-slot="select-item-content-text" :class="cn('min-w-0 truncate', props.textClass)">
        {{ props.label }}
      </span>

      <span v-if="props.description" data-slot="select-item-content-description" :class="cn('text-xs text-(--text-secondary-light) dark:text-(--text-secondary-dark)', props.descriptionClass)">
        {{ props.description }}
      </span>
    </div>
  </div>
</template>