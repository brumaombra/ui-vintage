<script setup lang="ts">
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

interface SwitchFormComponentProps {
  id: string
  label: string
  description: string
  modelValue: boolean
}

const props = defineProps<SwitchFormComponentProps>()

const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()
</script>

<template>
  <Card class="flex flex-row items-center justify-between gap-4 px-4 py-3">
    <div class="space-y-2">
      <div class="text-sm font-medium">
        {{ props.label }}
      </div>
      <div class="text-xs text-muted-foreground">
        {{ props.description }}
      </div>
    </div>

    <Switch
      :id="props.id"
      :model-value="props.modelValue"
      @update:model-value="emits('update:modelValue', $event)"
    />
  </Card>
</template>