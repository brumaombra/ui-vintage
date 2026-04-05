<script setup lang="ts">
import type { AlertDialogContentEmits, AlertDialogContentProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import {
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogPortal,
  useForwardPropsEmits,
} from "reka-ui"
import { cn } from "@/lib/utils"

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<AlertDialogContentProps & { class?: HTMLAttributes["class"] }>()
const emits = defineEmits<AlertDialogContentEmits>()

const delegatedProps = reactiveOmit(props, "class")

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <AlertDialogPortal>
    <AlertDialogOverlay data-slot="alert-dialog-overlay" class="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] transition-[opacity,backdrop-filter] ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <AlertDialogContent data-slot="alert-dialog-content" v-bind="{ ...$attrs, ...forwarded }" :class="cn(
      'bg-card text-card-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-[95%] max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-0 overflow-hidden rounded border shadow-2xl duration-200 sm:max-w-lg',
      props.class,
    )
      ">
      <slot />
    </AlertDialogContent>
  </AlertDialogPortal>
</template>
