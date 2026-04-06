<script setup lang="ts">
import { Busy } from "@/components/ui/busy"
import { busyIndicatorState } from "./busy-indicator-state"
</script>

<template>
  <Busy
    :show="busyIndicatorState.show"
    :label="busyIndicatorState.label"
    :class="busyIndicatorState.class"
    :overlay-class="busyIndicatorState.overlayClass"
  />
</template>