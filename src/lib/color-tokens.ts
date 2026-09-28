export type ToneColor = "gray" | "green" | "red" | "blue" | "yellow"
export type ButtonVariantName = "primary" | "secondary" | "ghost" | "link" | ToneColor

// Return the list of classes for a given tone color
const surfaceToneClasses: Record<ToneColor, string> = {
    gray: "border border-border bg-surface text-foreground",
    green: "border border-green-200 bg-green-50 text-green-700 dark:border-green-800/50 dark:bg-green-900/10 dark:text-green-400",
    red: "border border-red-200 bg-red-50 text-red-700 dark:border-red-800/50 dark:bg-red-900/10 dark:text-red-400",
    blue: "border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/50 dark:bg-blue-900/10 dark:text-blue-400",
    yellow: "border border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800/50 dark:bg-yellow-900/10 dark:text-yellow-400"
}

// Get the appropriate classes for a given tone color
export const getSurfaceToneClasses = (color: ToneColor) => {
    return surfaceToneClasses[color];
}

// Return the list of classes for interactive surfaces
const interactiveSurfaceToneClasses: Record<ToneColor, string> = {
    gray: `${surfaceToneClasses.gray} hover:border-border-strong hover:bg-accent`,
    green: `${surfaceToneClasses.green} hover:border-green-300 hover:bg-green-100 dark:hover:border-green-700/60 dark:hover:bg-green-900/20`,
    red: `${surfaceToneClasses.red} hover:border-red-300 hover:bg-red-100 dark:hover:border-red-700/60 dark:hover:bg-red-900/20`,
    blue: `${surfaceToneClasses.blue} hover:border-blue-300 hover:bg-blue-100 dark:hover:border-blue-700/60 dark:hover:bg-blue-900/20`,
    yellow: `${surfaceToneClasses.yellow} hover:border-yellow-300 hover:bg-yellow-100 dark:hover:border-yellow-700/60 dark:hover:bg-yellow-900/20`
}

// Get the appropriate classes for interactive surfaces based on tone color
export const getInteractiveSurfaceToneClasses = (color: ToneColor) => {
    return interactiveSurfaceToneClasses[color];
}

// Return the list of classes for button variants
export const buttonVariantClasses: Record<ButtonVariantName, string> = {
    // Custom button variants
    primary: "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.28),0_1px_2px_rgb(0_0_0/0.08)] hover:bg-primary-hover hover:shadow-glow",
    secondary: "border border-border bg-secondary text-foreground shadow-elevated-sm hover:border-border-strong hover:bg-accent",
    ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
    link: "text-primary underline-offset-4 decoration-2 hover:underline enabled:active:scale-100",

    // Tone-based button variants
    gray: getInteractiveSurfaceToneClasses("gray"),
    green: getInteractiveSurfaceToneClasses("green"),
    red: getInteractiveSurfaceToneClasses("red"),
    blue: getInteractiveSurfaceToneClasses("blue"),
    yellow: getInteractiveSurfaceToneClasses("yellow")
}

// Get the appropriate classes for a given button variant
export const getButtonVariantClasses = (variant: ButtonVariantName) => {
    return buttonVariantClasses[variant];
}