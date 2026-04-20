<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import BackgroundGrid from "@/components/background-grid/BackgroundGrid.vue";
import { Separator } from "@/components/ui/separator";
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
    SidebarTrigger
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type HugeiconsIconDefinition = readonly (readonly [string, { readonly [key: string]: string | number }])[];

interface DashboardSidebarItem {
    id: string;
    label: string;
    description?: string;
    icon?: HugeiconsIconDefinition | null;
    href?: string;
    to?: unknown;
    active?: boolean;
    newTab?: boolean;
}

interface DashboardSidebarSection {
    id: string;
    label?: string;
    items: DashboardSidebarItem[];
}

interface DashboardShellProps {
    title?: string;
    description?: string;
    collapsible?: "offcanvas" | "icon" | "none";
    sidebarSections?: DashboardSidebarSection[];
    sidebarLinkComponent?: Component | string;
    showBackground?: boolean;
    insetClass?: HTMLAttributes["class"];
    topbarClass?: HTMLAttributes["class"];
    contentContainerClass?: HTMLAttributes["class"];
}

// Props
const props = withDefaults(defineProps<DashboardShellProps>(), {
    title: "",
    description: "",
    collapsible: "offcanvas",
    sidebarSections: () => [],
    sidebarLinkComponent: "a",
    showBackground: true
});

// Resolve link props for sidebar items
const getSidebarItemLinkProps = (item: DashboardSidebarItem) => {
    const sharedProps = item.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {};

    // If the link component is an anchor, use href. Otherwise, use to for router links.
    if (props.sidebarLinkComponent === "a") {
        return {
            href: item.href ?? "#",
            ...sharedProps
        };
    }

    // For non-anchor link components, assume they use a "to" prop (like Vue Router's <RouterLink>).
    return {
        to: item.to ?? item.href ?? "/",
        ...sharedProps
    };
};
</script>

<template>
    <SidebarProvider>
        <!-- Sidebar -->
        <Sidebar :collapsible="props.collapsible">
            <!-- Sidebar header -->
            <SidebarHeader v-if="$slots['sidebar-header']" class="h-16 justify-center border-b border-sidebar-border">
                <slot name="sidebar-header" />
            </SidebarHeader>

            <!-- Sidebar sections -->
            <SidebarContent v-if="props.sidebarSections.length">
                <SidebarGroup v-for="section in props.sidebarSections" :key="section.id">
                    <!-- Section label -->
                    <SidebarGroupLabel v-if="section.label">
                        {{ section.label }}
                    </SidebarGroupLabel>

                    <!-- Section content -->
                    <SidebarGroupContent>
                        <SidebarMenu class="gap-3">
                            <SidebarMenuItem v-for="item in section.items" :key="item.id">
                                <SidebarMenuButton as-child :is-active="item.active" :class="cn('group h-auto min-h-12 rounded border border-[var(--border-light)] px-3 py-2.5 text-[var(--text-secondary-light)] transition-all duration-200 hover:border-[var(--border-hover-light)] hover:bg-[var(--bg-selected-light)] hover:text-[var(--text-primary-light)] data-[active=true]:border-[var(--border-hover-light)] data-[active=true]:bg-[var(--bg-selected-light)] data-[active=true]:text-[var(--text-primary-light)] dark:border-[var(--border-dark)] dark:text-[var(--text-secondary-dark)] dark:hover:border-[var(--border-hover-dark)] dark:hover:bg-[var(--bg-selected-dark)] dark:hover:text-[var(--text-primary-dark)] dark:data-[active=true]:border-[var(--border-hover-dark)] dark:data-[active=true]:bg-[var(--bg-selected-dark)] dark:data-[active=true]:text-[var(--text-primary-dark)] sm:px-4 sm:py-3', item.description ? 'items-start' : 'items-center')">
                                    <component :is="props.sidebarLinkComponent" v-bind="getSidebarItemLinkProps(item)">
                                        <!-- Icon -->
                                        <HugeiconsIcon v-if="item.icon" :icon="item.icon" :stroke-width="1.8" :class="cn('shrink-0 opacity-90 transition-opacity duration-200 group-hover:opacity-100', item.description ? 'mt-0.5 size-5 sm:h-5 sm:w-5' : 'size-5 self-center sm:h-6 sm:w-6')" />

                                        <!-- Label and optional description -->
                                        <div :class="cn('min-w-0 flex-1 text-left leading-tight', item.description ? 'grid' : 'flex items-center')">
                                            <!-- Label -->
                                            <span class="truncate font-semibold">{{ item.label }}</span>

                                            <!-- Description -->
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

            <!-- Sidebar footer -->
            <SidebarFooter v-if="$slots['sidebar-footer']" class="border-t border-sidebar-border">
                <slot name="sidebar-footer" />
            </SidebarFooter>
        </Sidebar>

        <!-- Main shell -->
        <SidebarInset :class="cn('relative min-h-screen min-w-0 bg-background text-foreground', props.insetClass)">
            <!-- Background -->
            <BackgroundGrid v-if="props.showBackground" />

            <!-- Topbar -->
            <header :class="cn('sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border bg-sidebar px-4 backdrop-blur', props.topbarClass)">
                <!-- Sidebar trigger -->
                <SidebarTrigger class="-ml-1" />

                <!-- Vertical separator -->
                <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />

                <!-- Optional custom content on the leading side of the topbar -->
                <slot name="topbar-leading" />

                <!-- Title and description -->
                <div class="min-w-0 flex-1">
                    <!-- Title -->
                    <div class="truncate text-sm font-medium">
                        {{ props.title }}
                    </div>

                    <!-- Description -->
                    <div v-if="props.description" class="truncate text-xs text-muted-foreground">
                        {{ props.description }}
                    </div>
                </div>

                <!-- Optional custom content on the trailing side of the topbar -->
                <slot name="topbar-trailing" />
            </header>

            <!-- Main content -->
            <main class="relative z-10 min-w-0 flex-1">
                <div :class="cn('mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-6 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8', props.contentContainerClass)">
                    <slot />
                </div>
            </main>

            <!-- Full-width footer -->
            <footer v-if="$slots.footer" class="relative z-10 mt-auto">
                <slot name="footer" />
            </footer>
        </SidebarInset>
    </SidebarProvider>
</template>