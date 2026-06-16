<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { HugeiconsIcon } from "@hugeicons/vue"
import { getSurfaceToneClasses, type ToneColor } from "../../../lib/color-tokens"
import { cn } from "../../../lib/utils"

type HugeiconsIconDefinition = readonly (readonly [string, { readonly [key: string]: string | number }])[]

// Props
const props = withDefaults(defineProps<{
    text: string
    icon?: HugeiconsIconDefinition | null
    color?: ToneColor
    class?: HTMLAttributes["class"]
}>(), {
    icon: null,
    color: "gray"
})
</script>

<template>
    <span data-slot="badge" :class="cn('inline-flex w-fit items-center justify-center gap-1.5 whitespace-nowrap rounded border px-2 py-0.5 text-xs font-semibold transition-colors duration-300 ease-in-out', getSurfaceToneClasses(props.color), props.class)">
        <HugeiconsIcon v-if="props.icon" :icon="props.icon" class="size-3.5 shrink-0" :stroke-width="1.8" />
        {{ props.text }}
    </span>
</template>