import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Button } from "./Button.vue"

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded text-xs font-medium transition-all duration-300 ease-in-out disabled:pointer-events-none disabled:opacity-50 enabled:active:scale-[0.98] sm:text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-(--button-primary-light) text-(--button-primary-foreground-light) hover:bg-(--button-primary-hover-light) dark:bg-(--button-primary-dark) dark:text-(--button-primary-foreground-dark) dark:hover:bg-(--button-primary-hover-dark)",
        primary:
          "bg-(--button-primary-light) text-(--button-primary-foreground-light) hover:bg-(--button-primary-hover-light) dark:bg-(--button-primary-dark) dark:text-(--button-primary-foreground-dark) dark:hover:bg-(--button-primary-hover-dark)",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        danger:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-(--border-light) bg-(--button-secondary-light) text-(--text-primary-light) hover:border-(--border-hover-light) hover:bg-(--bg-selected-light) dark:border-(--border-dark) dark:bg-(--button-secondary-dark) dark:text-(--text-primary-dark) dark:hover:border-(--border-hover-dark) dark:hover:bg-(--bg-selected-dark)",
        secondary:
          "border border-(--border-light) bg-(--button-secondary-light) text-(--text-primary-light) hover:border-(--border-hover-light) hover:bg-(--bg-selected-light) dark:border-(--border-dark) dark:bg-(--button-secondary-dark) dark:text-(--text-primary-dark) dark:hover:border-(--border-hover-dark) dark:hover:bg-(--bg-selected-dark)",
        ghost:
          "text-(--text-secondary-light) hover:bg-(--bg-selected-light) hover:text-(--text-primary-light) dark:text-(--text-secondary-dark) dark:hover:bg-(--bg-selected-dark) dark:hover:text-(--text-primary-dark)",
        link: "text-primary underline-offset-4 hover:underline",
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
      variant: "default",
      size: "default",
    },
  },
)
export type ButtonVariants = VariantProps<typeof buttonVariants>
