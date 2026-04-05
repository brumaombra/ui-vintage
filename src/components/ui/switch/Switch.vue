<script setup lang="ts">
import type { SwitchRootEmits, SwitchRootProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import {
  SwitchRoot,
  SwitchThumb,
  useForwardPropsEmits,
} from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<SwitchRootProps & { class?: HTMLAttributes["class"] }>()

const emits = defineEmits<SwitchRootEmits>()

const delegatedProps = reactiveOmit(props, "class")

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <SwitchRoot v-slot="slotProps" data-slot="switch" v-bind="forwarded" :class="cn(
    'peer relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded border border-(--border-light) bg-(--button-secondary-light) transition-all duration-200 outline-none focus-visible:border-(--border-hover-light) focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-60 data-[state=checked]:border-(--button-primary-light) data-[state=checked]:bg-(--bg-selected-light) dark:border-(--border-dark) dark:bg-(--button-secondary-dark) dark:focus-visible:border-(--border-hover-dark) dark:data-[state=checked]:border-(--button-primary-dark) dark:data-[state=checked]:bg-(--bg-selected-dark)',
    props.class,
  )">
    <SwitchThumb data-slot="switch-thumb" :class="cn('pointer-events-none absolute left-[4px] top-1/2 block h-4 w-4 -translate-y-1/2 rounded-[0.2rem] bg-(--text-secondary-light) ring-0 transition-all duration-200 data-[state=checked]:translate-x-6 data-[state=checked]:bg-(--button-primary-light) dark:bg-(--text-secondary-dark) dark:data-[state=checked]:bg-(--button-primary-dark)')">
      <slot name="thumb" v-bind="slotProps" />
    </SwitchThumb>
  </SwitchRoot>
</template>
