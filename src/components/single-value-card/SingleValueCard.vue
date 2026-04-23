<script setup lang="ts">
import { computed } from "vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import { Card, CardContent } from "@/components/ui/card";

// Props
const props = defineProps({
    value: { type: [String, Number], required: true },
    label: { type: String, required: true },
    icon: { type: Object, required: true },
    valueColor: { type: String, default: "default", validator: (value: unknown) => ["default", "green", "red", "gray"].includes(String(value)) }
});

// Value classes
const valueClass = computed(() => {
    switch (props.valueColor) {
        case "green":
            return "text-green-600 dark:text-green-400";
        case "red":
            return "text-red-600 dark:text-red-400";
        case "gray":
            return "text-gray-600 dark:text-gray-400";
        default:
            return "text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)]";
    }
});
</script>

<template>
    <Card class="flex-row items-center !p-4">
        <CardContent class="!p-0 gap-0 flex-row items-center">
            <!-- Icon -->
            <Card color="gray" class="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center !p-0">
                <HugeiconsIcon :icon="props.icon" class="size-5" />
            </Card>

            <!-- Content -->
            <div class="flex flex-col">
                <!-- Label -->
                <span class="mb-1 text-xs font-medium text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]">
                    {{ props.label }}
                </span>

                <!-- Value -->
                <span :class="['text-2xl md:text-xl font-bold', valueClass]">
                    {{ props.value }}
                </span>
            </div>
        </CardContent>
    </Card>
</template>