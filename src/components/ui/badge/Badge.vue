<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { getSurfaceToneClasses, type ToneColor } from "@/lib/color-tokens"
import { cn } from "@/lib/utils"

// Props
const props = withDefaults(defineProps<{
    text: string
    color?: ToneColor
    class?: HTMLAttributes["class"]
}>(), {
    color: "gray"
})
</script>

<template>
    <span data-slot="badge" :class="cn('inline-flex w-fit items-center justify-center whitespace-nowrap rounded border px-2 py-0.5 text-xs font-semibold transition-colors duration-300 ease-in-out', getSurfaceToneClasses(props.color), props.class)">
        {{ props.text }}
    </span>
</template>