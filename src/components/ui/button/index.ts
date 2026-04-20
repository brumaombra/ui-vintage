import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import { getButtonVariantClasses } from "@/lib/color-tokens"

export { default as Button } from "./Button.vue"

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded text-xs font-medium transition-all duration-300 ease-in-out disabled:pointer-events-none disabled:opacity-50 enabled:active:scale-[0.98] sm:text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        primary: getButtonVariantClasses("primary"),
        danger: getButtonVariantClasses("danger"),
        warning: getButtonVariantClasses("warning"),
        secondary: getButtonVariantClasses("secondary"),
        ghost: getButtonVariantClasses("ghost"),
        link: getButtonVariantClasses("link"),
      },
      size: {
        "default": "min-h-12 px-4 py-3 has-[>svg]:px-3",
        "sm": "min-h-10 gap-1.5 px-3 py-2 has-[>svg]:px-2.5",
        "lg": "min-h-12 px-6 py-3 has-[>svg]:px-4",
        "icon": "size-12",
        "icon-sm": "size-10",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
)
export type ButtonVariants = VariantProps<typeof buttonVariants>
