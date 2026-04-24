import type { ClassProp } from "class-variance-authority/types"
import { cva } from "class-variance-authority"
import type { ToneColor } from "@/lib/color-tokens"

export { default as Alert } from "./Alert.vue"
export { default as AlertDescription } from "./AlertDescription.vue"
export { default as AlertTitle } from "./AlertTitle.vue"

export type AlertColors = {
  color?: ToneColor | null | undefined
}

export const alertClasses: (props?: ClassProp) => string = cva(
  "relative w-full rounded px-3 py-2 text-xs transition-colors duration-300 ease-in-out grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current sm:px-4 sm:py-3 sm:text-sm",
)
