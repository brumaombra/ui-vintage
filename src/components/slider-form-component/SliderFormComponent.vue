<script setup lang="ts">
import { computed } from "vue";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface SliderFormComponentProps {
    id?: string;
    label: string;
    description?: string;
    modelValue: number;
    min?: number;
    max?: number;
    step?: number;
    valueText?: string;
}

// Props
const props = withDefaults(defineProps<SliderFormComponentProps>(), {
    id: undefined,
    description: "",
    min: 0,
    max: 100,
    step: 1,
    valueText: ""
});

// Emits
const emits = defineEmits<{
    (e: "update:modelValue", value: number): void;
}>();

const sliderValue = computed(() => [props.modelValue]);
const resolvedValueText = computed(() => props.valueText || String(props.modelValue));

// Emit the first slider value back to the parent
const handleUpdateModelValue = (value?: number[]) => {
    emits("update:modelValue", value?.[0] ?? props.min);
};
</script>

<template>
    <Card class="space-y-3 px-4 py-4">
        <!-- Slider header -->
        <div class="flex items-center justify-between gap-3">
            <!-- Label and description block -->
            <div class="space-y-2">
                <div class="text-sm font-medium">
                    {{ props.label }}
                </div>
                <div v-if="props.description" class="text-xs text-muted-foreground">
                    {{ props.description }}
                </div>
            </div>

            <!-- Current slider value display -->
            <span class="rounded border border-border bg-background px-2 py-1 text-xs font-medium">
                {{ resolvedValueText }}
            </span>
        </div>

        <!-- Slider control -->
        <Slider
            :id="props.id"
            :model-value="sliderValue"
            :min="props.min"
            :max="props.max"
            :step="props.step"
            @update:model-value="handleUpdateModelValue"
        />
    </Card>
</template>