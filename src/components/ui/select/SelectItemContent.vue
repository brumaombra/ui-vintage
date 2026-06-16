<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { HugeiconsIcon } from "@hugeicons/vue"
import { cn } from "../../../lib/utils"

type HugeiconsIconDefinition = readonly (readonly [string, { readonly [key: string]: string | number }])[]

// Props
const props = defineProps<{
    class?: HTMLAttributes["class"]
    icon?: HugeiconsIconDefinition | null
    label?: string | number | null
    description?: string | number | null
    iconClass?: HTMLAttributes["class"]
    textClass?: HTMLAttributes["class"]
    descriptionClass?: HTMLAttributes["class"]
}>()
</script>

<template>
    <div data-slot="select-item-content" :class="cn('flex min-w-0 flex-1 items-center gap-2', props.class)">
        <!-- Icon -->
        <div v-if="props.icon" data-slot="select-item-content-icon" :class="cn('shrink-0 self-center', props.iconClass)">
            <HugeiconsIcon :icon="props.icon" class="block size-3 sm:size-4" />
        </div>

        <!-- Text and description -->
        <div class="flex min-w-0 flex-1 flex-col gap-0.5">
            <!-- Text -->
            <span data-slot="select-item-content-text" :class="cn('min-w-0 truncate font-semibold text-xs sm:text-sm leading-5', props.textClass)">
                {{ props.label }}
            </span>

            <!-- Description -->
            <span v-if="props.description" data-slot="select-item-content-description" :class="cn('font-regular text-[11px] sm:text-xs leading-4 sm:leading-5 text-(--text-secondary-light) dark:text-(--text-secondary-dark)', props.descriptionClass)">
                {{ props.description }}
            </span>
        </div>
    </div>
</template>