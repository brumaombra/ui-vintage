<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue"
import BackgroundGrid from "@/components/background-grid/BackgroundGrid.vue"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface DashboardSidebarItem {
  id: string
  label: string
  description?: string
  icon?: Component | string
  href?: string
  to?: unknown
  active?: boolean
}

interface DashboardSidebarSection {
  id: string
  label?: string
  items: DashboardSidebarItem[]
}

interface DashboardShellProps {
  title?: string
  description?: string
  collapsible?: "offcanvas" | "icon" | "none"
  sidebarSections?: DashboardSidebarSection[]
  sidebarLinkComponent?: Component | string
  showBackground?: boolean
  insetClass?: HTMLAttributes["class"]
  topbarClass?: HTMLAttributes["class"]
  contentContainerClass?: HTMLAttributes["class"]
}

const props = withDefaults(defineProps<DashboardShellProps>(), {
  title: "",
  description: "",
  collapsible: "offcanvas",
  sidebarSections: () => [],
  sidebarLinkComponent: "a",
  showBackground: true,
})

const getSidebarItemLinkProps = (item: DashboardSidebarItem) => {
  if (props.sidebarLinkComponent === "a") {
    return { href: item.href ?? "#" }
  }

  return { to: item.to ?? item.href ?? "/" }
}
</script>

<template>
  <SidebarProvider>
    <Sidebar :collapsible="props.collapsible">
      <SidebarHeader v-if="$slots['sidebar-header']" class="h-16 justify-center border-b border-sidebar-border">
        <slot name="sidebar-header" />
      </SidebarHeader>

      <SidebarContent v-if="props.sidebarSections.length">
        <SidebarGroup v-for="section in props.sidebarSections" :key="section.id">
          <SidebarGroupLabel v-if="section.label">
            {{ section.label }}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu class="gap-3">
              <SidebarMenuItem v-for="item in section.items" :key="item.id">
                <SidebarMenuButton as-child :is-active="item.active" class="group h-auto min-h-12 items-start rounded border border-[var(--border-light)] px-3 py-2.5 text-[var(--text-secondary-light)] transition-all duration-200 hover:border-[var(--border-hover-light)] hover:bg-[var(--bg-selected-light)] hover:text-[var(--text-primary-light)] data-[active=true]:border-[var(--border-hover-light)] data-[active=true]:bg-[var(--bg-selected-light)] data-[active=true]:text-[var(--text-primary-light)] dark:border-[var(--border-dark)] dark:text-[var(--text-secondary-dark)] dark:hover:border-[var(--border-hover-dark)] dark:hover:bg-[var(--bg-selected-dark)] dark:hover:text-[var(--text-primary-dark)] dark:data-[active=true]:border-[var(--border-hover-dark)] dark:data-[active=true]:bg-[var(--bg-selected-dark)] dark:data-[active=true]:text-[var(--text-primary-dark)] sm:px-4 sm:py-3">
                  <component :is="props.sidebarLinkComponent" v-bind="getSidebarItemLinkProps(item)">
                    <component :is="item.icon" v-if="item.icon" :stroke-width="1.8" class="mt-0.5 h-4 w-4 shrink-0 opacity-90 transition-opacity duration-200 group-hover:opacity-100 sm:h-5 sm:w-5" />

                    <div class="grid min-w-0 flex-1 text-left leading-tight">
                      <span class="truncate font-semibold">{{ item.label }}</span>
                      <span v-if="item.description" class="mt-0.5 text-[11px] leading-4 text-sidebar-foreground/65">
                        {{ item.description }}
                      </span>
                    </div>
                  </component>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter v-if="$slots['sidebar-footer']" class="border-t border-sidebar-border">
        <slot name="sidebar-footer" />
      </SidebarFooter>
    </Sidebar>

    <SidebarInset :class="cn('relative min-h-screen min-w-0 bg-background text-foreground', props.insetClass)">
      <BackgroundGrid v-if="props.showBackground" />

      <header :class="cn('sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border bg-sidebar px-4 backdrop-blur', props.topbarClass)">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />

        <slot name="topbar-leading" />

        <div class="min-w-0 flex-1">
          <div class="truncate text-sm font-medium">
            {{ props.title }}
          </div>
          <div v-if="props.description" class="truncate text-xs text-muted-foreground">
            {{ props.description }}
          </div>
        </div>

        <slot name="topbar-trailing" />
      </header>

      <main class="relative z-10 min-w-0 flex-1">
        <div :class="cn('mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-6 p-3 sm:p-6 lg:p-8', props.contentContainerClass)">
          <div class="pb-4">
            <slot />
          </div>
        </div>
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>