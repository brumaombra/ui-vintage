import type { ClassProp } from 'class-variance-authority/types';
import type { HTMLAttributes } from 'vue';
import { cva } from 'class-variance-authority';

export { default as Sidebar } from './Sidebar.vue';
export { default as SidebarContent } from './SidebarContent.vue';
export { default as SidebarFooter } from './SidebarFooter.vue';
export { default as SidebarGroup } from './SidebarGroup.vue';
export { default as SidebarGroupAction } from './SidebarGroupAction.vue';
export { default as SidebarGroupContent } from './SidebarGroupContent.vue';
export { default as SidebarGroupLabel } from './SidebarGroupLabel.vue';
export { default as SidebarHeader } from './SidebarHeader.vue';
export { default as SidebarInput } from './SidebarInput.vue';
export { default as SidebarInset } from './SidebarInset.vue';
export { default as SidebarMenu } from './SidebarMenu.vue';
export { default as SidebarMenuAction } from './SidebarMenuAction.vue';
export { default as SidebarMenuBadge } from './SidebarMenuBadge.vue';
export { default as SidebarMenuButton } from './SidebarMenuButton.vue';
export { default as SidebarMenuItem } from './SidebarMenuItem.vue';
export { default as SidebarMenuSkeleton } from './SidebarMenuSkeleton.vue';
export { default as SidebarMenuSub } from './SidebarMenuSub.vue';
export { default as SidebarMenuSubButton } from './SidebarMenuSubButton.vue';
export { default as SidebarMenuSubItem } from './SidebarMenuSubItem.vue';
export { default as SidebarProvider } from './SidebarProvider.vue';
export { default as SidebarRail } from './SidebarRail.vue';
export { default as SidebarSeparator } from './SidebarSeparator.vue';
export { default as SidebarTrigger } from './SidebarTrigger.vue';

export { useSidebar } from './utils';

export interface SidebarProps {
    side?: 'left' | 'right';
    variant?: 'sidebar' | 'floating' | 'inset';
    collapsible?: 'offcanvas' | 'icon' | 'none';
    compact?: boolean;
    class?: HTMLAttributes['class'];
}

export type SidebarMenuButtonVariants = {
    variant?: 'default' | 'outline' | null | undefined;
    size?: 'default' | 'sm' | 'lg' | null | undefined;
};

export const sidebarMenuButtonVariants: (
    props?: SidebarMenuButtonVariants & ClassProp
) => string = cva(
    'peer/menu-button flex w-full items-center gap-2 rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,min-height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! group-data-[compact=true]/sidebar-wrapper:gap-1.5 group-data-[compact=true]/sidebar-wrapper:p-2.5 group-data-[compact=true]/sidebar-wrapper:[&>svg]:size-3.5 [&>svg]:size-4 [&>svg]:shrink-0',
    {
        variants: {
            variant: {
                default:
                    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                outline:
                    'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]'
            },
            size: {
                default:
                    'min-h-8 text-sm group-data-[compact=true]/sidebar-wrapper:min-h-7 group-data-[compact=true]/sidebar-wrapper:text-xs group-data-[compact=true]/sidebar-wrapper:py-3',
                sm: 'min-h-7 text-xs group-data-[compact=true]/sidebar-wrapper:min-h-6 group-data-[compact=true]/sidebar-wrapper:py-2.5',
                lg: 'min-h-12 text-sm group-data-[compact=true]/sidebar-wrapper:min-h-10 group-data-[collapsible=icon]:p-0!'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
);