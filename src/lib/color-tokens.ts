export type ToneColor = "gray" | "green" | "red" | "blue" | "yellow"
export type ButtonVariantName = "primary" | "secondary" | "ghost" | "link" | ToneColor

// Return the list of classes for a given tone color
const surfaceToneClasses: Record<ToneColor, string> = {
    gray: "border border-[var(--border-light)] bg-gray-50 text-[var(--text-primary-light)] dark:!border-[var(--border-dark)] dark:!bg-[var(--bg-card-dark)] dark:!text-[var(--text-primary-dark)]",
    green: "border border-green-200 bg-green-50 text-green-700 dark:!border-green-800/50 dark:!bg-green-900/10 dark:!text-green-400",
    red: "border border-red-200 bg-red-50 text-red-700 dark:!border-red-800/50 dark:!bg-red-900/10 dark:!text-red-400",
    blue: "border border-blue-200 bg-blue-50 text-blue-700 dark:!border-blue-800/50 dark:!bg-blue-900/10 dark:!text-blue-400",
    yellow: "border border-yellow-200 bg-yellow-50 text-yellow-700 dark:!border-yellow-800/50 dark:!bg-yellow-900/10 dark:!text-yellow-400"
}

// Get the appropriate classes for a given tone color
export const getSurfaceToneClasses = (color: ToneColor) => {
    return surfaceToneClasses[color]
}

// Return the list of classes for interactive surfaces
const interactiveSurfaceToneClasses: Record<ToneColor, string> = {
    gray: `${surfaceToneClasses.gray} hover:bg-gray-100 dark:hover:!bg-[var(--bg-selected-dark)]`,
    green: `${surfaceToneClasses.green} hover:bg-green-100 dark:hover:!bg-green-900/20`,
    red: `${surfaceToneClasses.red} hover:bg-red-100 dark:hover:!bg-red-900/20`,
    blue: `${surfaceToneClasses.blue} hover:bg-blue-100 dark:hover:!bg-blue-900/20`,
    yellow: `${surfaceToneClasses.yellow} hover:bg-yellow-100 dark:hover:!bg-yellow-900/20`
}

// Get the appropriate classes for interactive surfaces based on tone color
export const getInteractiveSurfaceToneClasses = (color: ToneColor) => {
    return interactiveSurfaceToneClasses[color]
}

// Return the list of classes for button variants
export const buttonVariantClasses: Record<ButtonVariantName, string> = {
    // Custom button variants
    primary: "bg-(--button-primary-light) text-(--button-primary-foreground-light) hover:bg-(--button-primary-hover-light) dark:!bg-(--button-primary-dark) dark:!text-(--button-primary-foreground-dark) dark:hover:!bg-(--button-primary-hover-dark)",
    secondary: "border border-(--border-light) bg-(--button-secondary-light) text-(--text-primary-light) hover:border-(--border-hover-light) hover:bg-(--bg-selected-light) dark:!border-(--border-dark) dark:!bg-(--button-secondary-dark) dark:!text-(--text-primary-dark) dark:hover:!border-(--border-hover-dark) dark:hover:!bg-(--bg-selected-dark)",
    ghost: "text-(--text-secondary-light) hover:bg-(--bg-selected-light) hover:text-(--text-primary-light) dark:!text-(--text-secondary-dark) dark:hover:!bg-(--bg-selected-dark) dark:hover:!text-(--text-primary-dark)",
    link: "text-primary underline-offset-4 hover:underline",

    // Tone-based button variants
    gray: getInteractiveSurfaceToneClasses("gray"),
    green: getInteractiveSurfaceToneClasses("green"),
    red: getInteractiveSurfaceToneClasses("red"),
    blue: getInteractiveSurfaceToneClasses("blue"),
    yellow: getInteractiveSurfaceToneClasses("yellow")
}

// Get the appropriate classes for a given button variant
export const getButtonVariantClasses = (variant: ButtonVariantName) => {
    return buttonVariantClasses[variant]
}