<script lang="ts" setup>
import type { CalendarPrevProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/vue"
import { CalendarPrev, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"
import { buttonVariants } from '@/components/ui/button'

const props = defineProps<CalendarPrevProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <CalendarPrev
    data-slot="calendar-prev-button"
    :class="cn(
      buttonVariants({ variant: 'secondary' }),
      'size-7 min-h-10 bg-transparent p-0 text-(--text-secondary-light) hover:text-(--text-primary-light) dark:text-(--text-secondary-dark) dark:hover:text-(--text-primary-dark)',
      props.class,
    )"
    v-bind="forwardedProps"
  >
    <slot>
      <HugeiconsIcon :icon="ArrowLeft01Icon" class="size-4" />
    </slot>
  </CalendarPrev>
</template>
