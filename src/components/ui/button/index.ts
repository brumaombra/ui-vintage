import type { ClassProp } from 'class-variance-authority/types';
import { cva } from 'class-variance-authority';
import { getButtonVariantClasses } from '../../../lib/color-tokens';

export { default as Button } from './Button.vue';

export type ButtonVariants = {
    variant?:
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'gray'
    | 'green'
    | 'red'
    | 'blue'
    | 'yellow'
    | null
    | undefined;
    size?:
    | 'default'
    | 'sm'
    | 'lg'
    | 'icon'
    | 'icon-sm'
    | 'icon-lg'
    | null
    | undefined;
};

export const buttonVariants: (props?: ButtonVariants & ClassProp) => string = cva(
    [
        "relative isolate inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded text-xs font-semibold outline-none sm:text-sm",
        "[transition:color_150ms,background-color_150ms,border-color_150ms,box-shadow_220ms,opacity_150ms,scale_380ms_var(--ease-spring)]",
        "enabled:active:scale-[0.97] enabled:active:duration-75 disabled:pointer-events-none disabled:opacity-50 data-loading:cursor-wait data-loading:disabled:opacity-100",
        "focus-visible:ring-[3px] focus-visible:ring-ring/45",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    ],
    {
        variants: {
            variant: {
                primary: getButtonVariantClasses('primary'),
                secondary: getButtonVariantClasses('secondary'),
                ghost: getButtonVariantClasses('ghost'),
                link: getButtonVariantClasses('link'),
                gray: getButtonVariantClasses('gray'),
                green: getButtonVariantClasses('green'),
                red: getButtonVariantClasses('red'),
                blue: getButtonVariantClasses('blue'),
                yellow: getButtonVariantClasses('yellow'),
            },
            size: {
                default: 'min-h-12 px-4 py-3 has-[>svg]:px-3',
                sm: 'min-h-10 gap-1.5 px-3 py-2 has-[>svg]:px-2.5',
                lg: 'min-h-[52px] px-4 py-3 has-[>svg]:px-4',
                icon: 'size-12',
                'icon-sm': 'size-10',
                'icon-lg': 'size-[52px]',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'default',
        },
    },
);