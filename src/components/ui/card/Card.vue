<script setup lang="ts">
import { computed } from "vue"
import type { HTMLAttributes } from "vue"
import { getSurfaceToneClasses, type ToneColor } from "@/lib/color-tokens"
import { cn } from "@/lib/utils"

type CardColor = "default" | ToneColor

// Props
const props = defineProps<{
    color?: CardColor
    class?: HTMLAttributes["class"]
}>()

// Get the appropriate classes
const colorClasses = computed(() => {
    // If color is not specified or is "default", use the default card styles
    if (!props.color || props.color === "default") {
        return "border border-border bg-card text-card-foreground"
    }

    // For other colors, use the corresponding surface tone classes
    return getSurfaceToneClasses(props.color)
})
</script>

<template>
    <div data-slot="card" :class="cn('flex flex-col gap-6 rounded py-6 transition-colors duration-300 ease-in-out', colorClasses, props.class)">
        <slot />
    </div>
</template>