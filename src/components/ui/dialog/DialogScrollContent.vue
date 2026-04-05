<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { X } from "lucide-vue-next"
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from "reka-ui"
import { cn } from "@/lib/utils"

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<DialogContentProps & { class?: HTMLAttributes["class"] }>()
const emits = defineEmits<DialogContentEmits>()

const delegatedProps = reactiveOmit(props, "class")

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DialogPortal>
    <DialogOverlay class="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/45 backdrop-blur-[2px] transition-[opacity,backdrop-filter] ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <DialogContent :class="cn(
        'relative z-50 my-8 grid w-[95%] max-w-lg gap-0 overflow-hidden rounded border border-border bg-card text-card-foreground shadow-2xl duration-200 md:w-full',
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

        <DialogClose class="absolute top-4 right-4 rounded border border-border bg-card p-1 text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground">
          <X class="w-4 h-4" />
          <span class="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </DialogOverlay>
  </DialogPortal>
</template>
