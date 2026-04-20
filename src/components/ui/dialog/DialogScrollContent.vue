<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from "reka-ui"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DialogContentProps & {
  class?: HTMLAttributes["class"]
  showCloseButton?: boolean
}>(), {
  showCloseButton: false,
})
const emits = defineEmits<DialogContentEmits>()

const delegatedProps = reactiveOmit(props, "class")

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DialogPortal>
    <DialogOverlay class="fixed inset-0 isolate z-50 grid place-items-center overflow-y-auto bg-black/45 backdrop-blur-[2px] transition-[opacity,backdrop-filter] ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <DialogContent :class="cn(
        'relative z-50 my-6 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded border border-border bg-card p-6 text-card-foreground outline-none duration-200 sm:max-w-[425px]',
        props.class,
      )
        " v-bind="{ ...$attrs, ...forwarded }" @pointer-down-outside="(event) => {
          const originalEvent = event.detail.originalEvent;
          const target = originalEvent.target as HTMLElement;
          if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) {
            event.preventDefault();
          }
        }">
        <slot />

        <DialogClose v-if="props.showCloseButton" data-slot="dialog-close" as-child>
          <Button variant="ghost" size="icon-sm" class="absolute top-4 right-4 p-0.5">
            <span aria-hidden="true">X</span>
            <span class="sr-only">Close</span>
          </Button>
        </DialogClose>
      </DialogContent>
    </DialogOverlay>
  </DialogPortal>
</template>
