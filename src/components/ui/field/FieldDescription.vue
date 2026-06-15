<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <p data-slot="field-description" :class="cn(
    '!text-xs sm:!text-xs leading-5 font-normal text-(--text-secondary-light) dark:text-(--text-secondary-dark) group-has-[[data-orientation=horizontal]]/field:text-balance',
    'last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5',
    '[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
    props.class,
  )">
    <slot />
  </p>
</template>
