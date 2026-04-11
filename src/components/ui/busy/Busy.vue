<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/vue"
import { cn } from "@/lib/utils"

interface BusyProps {
  show?: boolean
  label?: string
  class?: HTMLAttributes["class"]
  overlayClass?: HTMLAttributes["class"]
}

const props = withDefaults(defineProps<BusyProps>(), {
  show: false,
  label: "Loading...",
})
</script>

<template>
  <Transition name="busy-fade">
    <div v-if="props.show" data-slot="busy-overlay" :class="cn('fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] transition-[opacity,backdrop-filter] duration-300 ease-out', props.overlayClass)">
      <div data-slot="busy-content" role="status" aria-live="polite" aria-busy="true" :class="cn('bg-card text-card-foreground flex w-72 flex-col items-center justify-center gap-4 rounded border border-border px-8 py-7 text-center shadow-2xl', props.class)">
        <slot>
          <HugeiconsIcon data-slot="busy-spinner" :icon="Loading03Icon" class="size-10 animate-spin text-primary" />
          <span v-if="props.label" data-slot="busy-label" class="text-xs font-medium text-foreground sm:text-sm">
            {{ props.label }}
          </span>
        </slot>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.busy-fade-enter-active,
.busy-fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.busy-fade-enter-from,
.busy-fade-leave-to {
  opacity: 0;
}
</style>