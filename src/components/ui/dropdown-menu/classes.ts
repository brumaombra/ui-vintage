// Shared surface classes for the root menu and sub menus
export const dropdownMenuSurfaceClass = 'uv-floating-motion bg-popover text-popover-foreground z-50 min-w-48 overflow-x-hidden overflow-y-auto rounded border border-border p-1 shadow-elevated-lg outline-hidden';

// Lightweight entrance stagger for the first ~8 direct children (runs once on open, not on highlight)
export const dropdownMenuStaggerClass = [
    '[&[data-state=open]>*]:animate-[uv-float-in_240ms_var(--ease-out-expo)_both] [&>*]:[--uv-float-offset:-3px]',
    '[&[data-state=open]>*:nth-child(2)]:[animation-delay:16ms]',
    '[&[data-state=open]>*:nth-child(3)]:[animation-delay:32ms]',
    '[&[data-state=open]>*:nth-child(4)]:[animation-delay:48ms]',
    '[&[data-state=open]>*:nth-child(5)]:[animation-delay:64ms]',
    '[&[data-state=open]>*:nth-child(6)]:[animation-delay:80ms]',
    '[&[data-state=open]>*:nth-child(7)]:[animation-delay:96ms]',
    '[&[data-state=open]>*:nth-child(8)]:[animation-delay:112ms]',
    '[&[data-state=open]>*:nth-child(n+9)]:[animation-delay:128ms]'
].join(' ');

// Shared item classes (items, checkbox/radio items, sub triggers)
export const dropdownMenuItemClass = [
    'relative flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-xs font-semibold text-muted-foreground outline-hidden select-none transition-colors duration-150 sm:text-sm',
    'data-highlighted:bg-accent data-highlighted:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-9',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
    // A primary bar springs onto the highlighted item, like in the command palette
    'before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:scale-y-0 before:rounded-full before:bg-primary before:transition-transform before:duration-300 before:ease-spring data-highlighted:before:scale-y-100',
    // Leading icons nudge slightly when the item is highlighted
    '[&>svg]:transition-transform [&>svg]:duration-300 [&>svg]:ease-spring [&[data-highlighted]>svg]:translate-x-0.5 [&[data-highlighted]>svg]:scale-110'
].join(' ');