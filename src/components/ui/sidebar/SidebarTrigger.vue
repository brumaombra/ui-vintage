<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { PanelLeftIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/vue"
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import { useSidebar } from "./utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

const { toggleSidebar } = useSidebar()
</script>

<template>
  <Button data-sidebar="trigger" data-slot="sidebar-trigger" variant="secondary" size="icon" :class="cn(props.class)" @click="toggleSidebar">
    <HugeiconsIcon :icon="PanelLeftIcon" />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
