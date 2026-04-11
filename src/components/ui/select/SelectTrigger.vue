<script setup lang="ts">
import type { SelectTriggerProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/vue"
import { SelectIcon, SelectTrigger, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<SelectTriggerProps & { class?: HTMLAttributes["class"], size?: "sm" | "default" }>(),
  { size: "default" },
)

const delegatedProps = reactiveOmit(props, "class", "size")
const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <SelectTrigger data-slot="select-trigger" :data-size="size" v-bind="forwardedProps" :class="cn(
    'data-[placeholder]:text-(--text-secondary-light) [&_svg:not([class*=\'text-\'])]:text-(--text-secondary-light) flex w-fit cursor-pointer items-center justify-between gap-2 rounded border border-(--border-light) bg-(--button-secondary-light) px-4 py-3 text-xs font-medium whitespace-nowrap text-(--text-primary-light) transition-all duration-300 ease-in-out outline-none disabled:cursor-not-allowed disabled:opacity-60 data-[size=default]:h-[52px] data-[size=sm]:h-10 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 dark:border-(--border-dark) dark:bg-(--button-secondary-dark) dark:text-(--text-primary-dark) dark:data-[placeholder]:text-(--text-secondary-dark) dark:[&_svg:not([class*=\'text-\'])]:text-(--text-secondary-dark) sm:text-sm',
    'focus-visible:border-(--border-hover-light) focus-visible:ring-0 dark:focus-visible:border-(--border-hover-dark)',
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
    props.class,
  )">
    <slot />
    <SelectIcon as-child>
      <HugeiconsIcon :icon="ArrowDown01Icon" class="size-4 opacity-50" />
    </SelectIcon>
  </SelectTrigger>
</template>
