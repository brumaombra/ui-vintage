<script setup lang="ts">
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/vue"
import type { HTMLAttributes } from "vue"
import { getSurfaceToneClasses, type ToneColor } from "@/lib/color-tokens"
import { cn } from "@/lib/utils"

// Props
const props = withDefaults(defineProps<{
    text: string
    color?: ToneColor
    removeLabel?: string
    class?: HTMLAttributes["class"]
}>(), {
    color: "gray",
    removeLabel: "Remove"
})

// Emits
const emits = defineEmits<{
    remove: []
}>()

// Handle remove button click
const handleRemove = () => {
    emits("remove")
}
</script>

<template>
    <div data-slot="chip" :class="cn('inline-flex items-center gap-2 rounded border px-3 py-2 text-sm font-semibold transition-colors duration-300 ease-in-out', getSurfaceToneClasses(props.color), props.class)">
        <!-- Text content -->
        <span class="leading-none">{{ props.text }}</span>

        <!-- Remove button -->
        <button type="button" :aria-label="props.removeLabel" class="inline-flex size-4 items-center justify-center rounded-sm opacity-70 transition-all duration-200 ease-in-out hover:bg-black/5 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/20 dark:hover:bg-white/10" @click="handleRemove">
            <HugeiconsIcon :icon="Cancel01Icon" class="size-3" />
        </button>
    </div>
</template>