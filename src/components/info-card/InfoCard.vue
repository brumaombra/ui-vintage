<script setup lang="ts">
import { HugeiconsIcon } from "@hugeicons/vue"
import { Card, CardContent, CardText } from "@/components/ui/card"

// Props
const props = defineProps({
    icon: { type: Object, required: true },
    title: { type: String, default: "" },
    description: { type: [String, Number], default: "" }
})
</script>

<template>
    <Card class="flex flex-col items-center !p-4 sm:flex-row">
        <CardContent class="flex w-full flex-col items-center gap-0 !p-0 sm:flex-row">
            <!-- Icon -->
            <Card color="gray" class="mb-3 mr-0 flex h-12 w-12 flex-shrink-0 items-center justify-center !p-0 sm:mb-0 sm:mr-4">
                <HugeiconsIcon :icon="props.icon" class="size-5" />
            </Card>

            <!-- Content -->
            <div class="flex w-full flex-1 items-center justify-between text-center sm:w-auto sm:text-left">
                <div class="flex flex-col">
                    <!-- Title -->
                    <span class="text-base font-bold text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)]">
                        {{ props.title }}
                    </span>

                    <!-- Description -->
                    <CardText v-if="props.description">
                        {{ props.description }}
                    </CardText>
                </div>

                <!-- Right slot for custom elements -->
                <div v-if="$slots.right" class="ml-4">
                    <slot name="right" />
                </div>
            </div>
        </CardContent>
    </Card>
</template>