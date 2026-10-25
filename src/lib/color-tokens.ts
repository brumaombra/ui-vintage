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
	primary: "bg-primary text-primary-foreground shadow-elevated-sm hover:bg-primary-hover before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:-translate-x-full before:bg-[linear-gradient(105deg,transparent_35%,rgb(255_255_255/0.38)_50%,transparent_65%)] before:transition-[translate] before:duration-700 before:ease-out-expo hover:before:translate-x-full motion-reduce:before:hidden",
	secondary: "border border-border bg-secondary text-foreground shadow-elevated-sm hover:border-border-strong hover:bg-accent",
	ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
	link: "text-foreground underline decoration-primary decoration-2 underline-offset-[5px] enabled:active:scale-100", // Dark text with the brand orange underline, like the blog links (orange text is only 2.3:1 on white)

	// Tone-based button variants (the secondary shadow, so they read as buttons next to it, and a stronger tint in dark mode)
	gray: `${getInteractiveSurfaceToneClasses("gray")} shadow-elevated-sm`,
	green: `${getInteractiveSurfaceToneClasses("green")} shadow-elevated-sm dark:bg-green-900/25 dark:hover:bg-green-900/40`,
	red: `${getInteractiveSurfaceToneClasses("red")} shadow-elevated-sm dark:bg-red-900/25 dark:hover:bg-red-900/40`,
	blue: `${getInteractiveSurfaceToneClasses("blue")} shadow-elevated-sm dark:bg-blue-900/25 dark:hover:bg-blue-900/40`,
	yellow: `${getInteractiveSurfaceToneClasses("yellow")} shadow-elevated-sm dark:bg-yellow-900/25 dark:hover:bg-yellow-900/40`
}

// Get the appropriate classes for a given button variant
export const getButtonVariantClasses = (variant: ButtonVariantName) => {
	return buttonVariantClasses[variant];
}