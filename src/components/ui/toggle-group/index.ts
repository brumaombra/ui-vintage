import type { ClassProp } from 'class-variance-authority/types';
import type { InjectionKey, Ref } from 'vue';
import { cva } from 'class-variance-authority';

export { default as Toggle } from './Toggle.vue';
export { default as ToggleGroup } from './ToggleGroup.vue';
export { default as ToggleGroupItem } from './ToggleGroupItem.vue';

export type ToggleVariants = {
    variant?: 'default' | 'outline' | null | undefined;
    size?: 'default' | 'sm' | 'lg' | null | undefined;
};

export type ToggleGroupSize = 'default' | 'sm' | 'lg';

// Standalone toggle button
export const toggleVariants: (props?: ToggleVariants & ClassProp) => string = cva(
    [
        "inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded text-xs font-semibold text-muted-foreground outline-none sm:text-sm",
        "[transition:color_150ms,background-color_150ms,border-color_150ms,box-shadow_220ms,opacity_150ms,transform_380ms_var(--ease-spring)]",
        "hover:bg-accent hover:text-foreground active:scale-[0.97] active:duration-75 disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:ring-[3px] focus-visible:ring-ring/45",
        "data-[state=on]:bg-accent data-[state=on]:text-foreground",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    ],
    {
        variants: {
            variant: {
                default: 'bg-transparent',
                outline: 'border border-border bg-secondary shadow-elevated-sm hover:border-border-strong data-[state=on]:border-border-strong',
            },
            size: {
                default: 'h-10 min-w-10 px-3',
                sm: 'h-8 min-w-8 gap-1.5 px-2',
                lg: 'h-12 min-w-12 px-4',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

// Segmented control item (sits above the sliding indicator)
export const toggleGroupItemVariants: (props?: { size?: ToggleGroupSize | null } & ClassProp) => string = cva(
    [
        "relative z-10 inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-sm text-xs font-semibold text-muted-foreground outline-none sm:text-sm",
        "[transition:color_150ms,background-color_150ms,box-shadow_220ms,opacity_150ms,transform_380ms_var(--ease-spring)]",
        "hover:text-foreground data-[state=on]:text-foreground active:scale-[0.96] active:duration-75 disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:ring-[3px] focus-visible:ring-ring/45",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    ],
    {
        variants: {
            size: {
                default: 'h-9 px-3',
                sm: 'h-7 px-2.5',
                lg: 'h-11 px-4',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    },
);

// Context shared by a toggle group with its items
export const toggleGroupContextKey: InjectionKey<{ size: Ref<ToggleGroupSize>; indicator: Ref<boolean> }> = Symbol('uv-toggle-group');