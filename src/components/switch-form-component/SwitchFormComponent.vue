<script setup lang="ts">
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface SwitchFormComponentProps {
    id: string;
    label: string;
    description: string;
    modelValue: boolean;
}

// Props
const props = defineProps<SwitchFormComponentProps>();

// Emits
const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
}>();
</script>

<template>
    <Card class="flex flex-col gap-2 sm:!gap-3 px-4 py-3">
        <!-- Switch label and control -->
        <div class="flex items-center justify-between gap-4">
            <!-- Switch label -->
            <div class="text-sm font-semibold">
                {{ props.label }}
            </div>

            <!-- Switch control -->
            <Switch :id="props.id" :model-value="props.modelValue" @update:model-value="emits('update:modelValue', $event)" />
        </div>

        <!-- Description -->
        <div class="text-xs text-muted-foreground">
            {{ props.description }}
        </div>
    </Card>
</template>