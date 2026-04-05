import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Alert } from "./Alert.vue"
export { default as AlertDescription } from "./AlertDescription.vue"
export { default as AlertTitle } from "./AlertTitle.vue"

export const alertVariants = cva(
  "relative w-full rounded border border-(--border-light) bg-(--bg-surface-light) px-3 py-2 text-xs text-(--text-secondary-light) transition-colors duration-300 ease-in-out grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current dark:border-(--border-dark) dark:bg-(--bg-surface-dark) dark:text-(--text-secondary-dark) sm:px-4 sm:py-3 sm:text-sm",
  {
    variants: {
      variant: {
        default: "",
        destructive:
          "text-destructive [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export type AlertVariants = VariantProps<typeof alertVariants>
