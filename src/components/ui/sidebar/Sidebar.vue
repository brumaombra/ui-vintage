<script setup lang="ts">
import type { SidebarProps } from "."
import { cn } from "../../../lib/utils"
import { Sheet, SheetContent } from '../sheet'
import SheetDescription from '../sheet/SheetDescription.vue'
import SheetHeader from '../sheet/SheetHeader.vue'
import SheetTitle from '../sheet/SheetTitle.vue'
import { SIDEBAR_WIDTH_MOBILE, useSidebar } from "./utils"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SidebarProps>(), {
  side: "left",
  variant: "sidebar",
  collapsible: "offcanvas",
  compact: false,
})

const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

function handleMobileSidebarClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null

  if (target?.closest('[data-sidebar="menu-button"]')) {
    setOpenMobile(false)
  }
}
</script>

<template>
  <div v-if="collapsible === 'none'" data-slot="sidebar" :class="cn('group/sidebar-wrapper bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col', props.class)" v-bind="$attrs">
    <slot />
  </div>

  <Sheet v-else-if="isMobile" :open="openMobile" v-bind="$attrs" @update:open="setOpenMobile">
    <SheetContent data-sidebar="sidebar" data-slot="sidebar" data-mobile="true" :data-compact="props.compact ? 'true' : 'false'" :side="side" class="group/sidebar-wrapper border-sidebar-border bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden" :style="{
      '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
    }">
      <SheetHeader class="sr-only">
        <SheetTitle>Sidebar</SheetTitle>
        <SheetDescription>Displays the mobile sidebar.</SheetDescription>
      </SheetHeader>
      <div class="flex h-full w-full flex-col" @click="handleMobileSidebarClick">
        <slot />
      </div>
    </SheetContent>
  </Sheet>

  <div v-else class="group/sidebar-wrapper group peer text-sidebar-foreground hidden md:block" data-slot="sidebar" :data-state="state" :data-collapsible="state === 'collapsed' ? collapsible : ''" :data-variant="variant" :data-side="side">
    <!-- This is what handles the sidebar gap on desktop  -->
    <div :class="cn(
      'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
      'group-data-[collapsible=offcanvas]:w-0',
      'group-data-[side=right]:rotate-180',
      variant === 'floating' || variant === 'inset'
        ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
    )" />
    <div :class="cn(
      'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
      side === 'left'
        ? 'left-0 group-data-[collapsible=offcanvas]:-left-(--sidebar-width)'
        : 'right-0 group-data-[collapsible=offcanvas]:-right-(--sidebar-width)',
      // Adjust the padding for floating and inset variants.
      variant === 'floating' || variant === 'inset'
        ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
        : 'border-sidebar-border group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
      props.class,
    )" v-bind="$attrs">
      <div data-sidebar="sidebar" class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm">
        <slot />
      </div>
    </div>
  </div>
</template>
