// Curated metadata for COMPONENTS.md. Every package.json entry point needs an entry here
// (the generator fails otherwise). Props, events, slots, and exports are read from the source.

export const categories = [
    { id: 'actions', title: 'Actions', description: 'Buttons, segmented controls, menus, and keyboard hints.' },
    { id: 'forms', title: 'Forms', description: 'Inputs, pickers, and form layout. Text-like controls share the `uv-field` focus glow and shake on `aria-invalid`.' },
    { id: 'data', title: 'Data display', description: 'Surfaces, tables, stats, and status indicators.' },
    { id: 'navigation', title: 'Navigation', description: 'Tabs, steps, pagination, disclosures, and sidebars.' },
    { id: 'overlays', title: 'Overlays', description: 'Modals, sheets, and floating surfaces built on Reka UI.' },
    { id: 'feedback', title: 'Feedback', description: 'Toasts, promise-based dialogs, the busy overlay, alerts, and empty or loading states. The runtime flows mount themselves lazily, so no component needs to be placed in the app.' },
    { id: 'layout', title: 'Layouts and app shell', description: 'Application shells, page headers, error pages, and theme or language controls.' },
    { id: 'content', title: 'Content and blog', description: 'Components for Nuxt Content pages and a complete blog.' },
    { id: 'utilities', title: 'Utilities and types', description: 'Helpers shared by the components.' }
];

export const entries = {
    /*********************** Actions ***********************/

    'button': {
        category: 'actions',
        description: 'Button with solid, outline, ghost, link, and tone variants. Spring press feedback, a sheen on primary buttons, and a `loading` state that keeps the width stable. Use `as-child` to render a link.',
        example: `
<Button variant="secondary" size="sm" :loading="saving" @click="save">
    <HugeiconsIcon :icon="SaveIcon" />
    Save changes
</Button>

<Button as-child>
    <NuxtLink to="/pricing">Pricing</NuxtLink>
</Button>`
    },
    'toggle-group': {
        category: 'actions',
        description: 'Segmented control (`type="single"`, with a sliding indicator) or multi-select toggle group, plus a standalone `Toggle`.',
        example: `
<ToggleGroup v-model="view" type="single" highlight>
    <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
    <ToggleGroupItem value="list">List</ToggleGroupItem>
</ToggleGroup>`
    },
    'dropdown-menu': {
        category: 'actions',
        description: 'Menu of actions with items, checkbox and radio items, labels, shortcuts, destructive items, and submenus.',
        example: `
<DropdownMenu>
    <DropdownMenuTrigger as-child>
        <Button variant="secondary">Account</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuItem @select="openProfile">Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut></DropdownMenuItem>
        <DropdownMenuCheckboxItem v-model="showStatusBar">Status bar</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" @select="logout">Log out</DropdownMenuItem>
    </DropdownMenuContent>
</DropdownMenu>`
    },
    'kbd': {
        category: 'actions',
        description: 'Keycaps for keyboard shortcuts. In `KbdGroup`, `mod` renders ⌘ on macOS and Ctrl elsewhere.',
        example: `
<KbdGroup :keys="['mod', 'k']" />
<Kbd>Esc</Kbd>`
    },
    'text-link': {
        category: 'actions',
        description: 'Inline text link that renders an anchor or a router link component (pass `NuxtLink` as `link-component`).'
    },
    'load-more-button': {
        category: 'actions',
        description: 'Full-width "load more" button with a built-in busy state and localized labels.'
    },

    /*********************** Forms ***********************/

    'input': {
        category: 'forms',
        description: 'Text input with `v-model`. Set `aria-invalid` to show the error state.'
    },
    'textarea': {
        category: 'forms',
        description: 'Auto-growing textarea with `v-model` (uses `field-sizing: content`).'
    },
    'label': {
        category: 'forms',
        description: 'Accessible form label (Reka `Label`).'
    },
    'field': {
        category: 'forms',
        description: 'Form layout primitives: label, description, error list, groups, and fieldsets. `FieldError` accepts strings or `{ message }` objects and hides itself when empty.',
        example: `
<Field>
    <FieldLabel for="email">Email</FieldLabel>
    <FieldContent>
        <Input id="email" v-model="email" :aria-invalid="!!emailError || undefined" />
        <FieldError :errors="[emailError]" />
        <FieldDescription>We will send the invite here.</FieldDescription>
    </FieldContent>
</Field>`
    },
    'select': {
        category: 'forms',
        description: 'Styled Reka select. `SelectValueContent` and `SelectItemContent` render an icon, label, and description.',
        example: `
<Select v-model="region">
    <SelectTrigger class="w-full">
        <SelectValueContent placeholder="Choose a region" :label="selectedRegion?.label" />
    </SelectTrigger>
    <SelectContent>
        <SelectItem v-for="option in regions" :key="option.value" :value="option.value" :text-value="option.label">
            <SelectItemContent :icon="option.icon" :label="option.label" :description="option.description" />
        </SelectItem>
    </SelectContent>
</Select>`
    },
    'native-select': {
        category: 'forms',
        description: 'Native `<select>` with the library styling, for simple or mobile-first forms.'
    },
    'combobox': {
        category: 'forms',
        description: 'Searchable select. Use `ComboboxSelect` for the common case (single or `multiple`, rich options); the other parts compose custom comboboxes.',
        example: `
<ComboboxSelect v-model="framework" :options="[{ value: 'nuxt', label: 'Nuxt', description: 'The Vue framework' }]" placeholder="Search frameworks" />
<ComboboxSelect v-model="stack" :options="options" multiple placeholder="Pick your stack" />`
    },
    'checkbox': {
        category: 'forms',
        description: 'Checkbox with a self-drawing check mark. `v-model` accepts `true`, `false`, or `\'indeterminate\'`.',
        example: `
<Checkbox id="terms" v-model="accepted" />
<Label for="terms">I accept the terms</Label>`
    },
    'radio-group': {
        category: 'forms',
        description: 'Radio group with plain items or selectable `RadioGroupCard` rows (icon, label, description).',
        example: `
<RadioGroup v-model="plan">
    <RadioGroupCard value="pro" label="Pro" description="Unlimited projects" :icon="Rocket01Icon" />
    <RadioGroupCard value="team" label="Team" description="SSO and audit logs" />
</RadioGroup>`
    },
    'switch': {
        category: 'forms',
        description: 'On/off switch with `v-model` (boolean).'
    },
    'slider': {
        category: 'forms',
        description: 'Range slider. `v-model` is an array, one value per thumb (`[50]` or `[20, 80]`).'
    },
    'number-field': {
        category: 'forms',
        description: 'Numeric input with increment and decrement buttons, bounds, and `Intl` formatting (`format-options`).',
        example: `
<NumberField v-model="seats" :min="1" :max="50" />
<NumberField v-model="price" :step="0.1" :format-options="{ style: 'currency', currency: 'EUR' }" />`
    },
    'pin-input': {
        category: 'forms',
        description: 'One-time code input. Pass `length` to render the cells automatically; `v-model` is an array of characters.',
        example: `
<PinInput v-model="code" :length="6" otp type="number" :separator-after="2" :invalid="codeInvalid" @complete="verify" />`
    },
    'tags-input': {
        category: 'forms',
        description: 'Free-text tags input. Without a default slot it renders the tags from `v-model` and an input automatically.',
        example: `
<TagsInput v-model="skills" placeholder="Add a skill..." />`
    },
    'calendar': {
        category: 'forms',
        description: 'Month calendar (Reka) working with `@internationalized/date` values. Usually used through `DatePicker`.'
    },
    'date-picker': {
        category: 'forms',
        description: 'Date picker button with a calendar popover. `v-model` is a `DateValue` from `@internationalized/date`; labels follow the vue-i18n locale.'
    },
    'date-time-picker': {
        category: 'forms',
        description: 'Date and time picker pair. `v-model` is a JavaScript `Date` or `null`.'
    },
    'time-picker': {
        category: 'forms',
        description: 'Time input with `v-model` as an `HH:mm` (or `HH:mm:ss`) string.'
    },
    'file-dropzone': {
        category: 'forms',
        description: 'Drag-and-drop file picker with type, size, and count limits, a rejection event, and an animated file list. `v-model` is a `File[]`.',
        example: `
<FileDropzone v-model="files" accept="image/*,.pdf" :max-size="5 * 1024 * 1024" :max-files="4" @reject="onReject" />`
    },
    'switch-form-component': {
        category: 'forms',
        description: 'Card row with a label, description, and switch, for settings pages.'
    },
    'slider-form-component': {
        category: 'forms',
        description: 'Card with a label, description, value badge, and single-value slider (`v-model` is a number).'
    },

    /*********************** Data display ***********************/

    'card': {
        category: 'data',
        description: 'Surface container with header, title, description, content, footer, and action slots. `interactive` adds a hover lift and pointer spotlight; `color` switches to a tone surface.',
        example: `
<Card interactive>
    <CardHeader>
        <CardTitle>Deployments</CardTitle>
        <CardDescription>Ship previews for every branch.</CardDescription>
    </CardHeader>
    <CardContent>...</CardContent>
</Card>`
    },
    'data-table': {
        category: 'data',
        description: 'Typed data table with client-side sorting (animated rows), row selection, skeleton loading, empty state, and `cell-<key>` / `header-<key>` slots. Set `manual-sort` to sort on the server.',
        example: `
<DataTable v-model:selected="selected" v-model:sort="sort" :columns="columns" :rows="customers" selectable :loading="loading">
    <template #cell-status="{ row }">
        <Badge :text="row.status" color="green" dot />
    </template>
</DataTable>`
    },
    'table': {
        category: 'data',
        description: 'Low-level table parts (header, body, row, cell, caption, footer, empty row) for fully custom tables.'
    },
    'data-list': {
        category: 'data',
        description: 'Key-value rows for detail panels.'
    },
    'single-value-card': {
        category: 'data',
        description: 'KPI card. Numeric values count up and tween on change; optional trend badge and description.',
        example: `
<SingleValueCard label="Revenue" :value="48290" :icon="Money03Icon" :trend="12.4" trend-label="vs last month"
    :format-options="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }" />`
    },
    'animated-number': {
        category: 'data',
        description: 'Number that counts up on mount and tweens to new values, formatted with `Intl.NumberFormat`.'
    },
    'info-card': {
        category: 'data',
        description: 'Horizontal card with an icon, title, description, and a `right` slot for actions or badges.'
    },
    'avatar': {
        category: 'data',
        description: 'Avatar with image, generated initials (`AvatarFallback name`), sizes, shapes, and status dots. `AvatarGroup` stacks avatars with a `+N` overflow.',
        example: `
<AvatarGroup :max="3">
    <Avatar v-for="user in users" :key="user.id" status="online">
        <AvatarImage :src="user.avatar" :alt="user.name" />
        <AvatarFallback :name="user.name" />
    </Avatar>
</AvatarGroup>`
    },
    'badge': {
        category: 'data',
        description: 'Small status label in five tones, with an optional icon, `dot`, or pulsing `pulse` indicator.',
        example: `
<Badge text="Operational" color="green" pulse />`
    },
    'chip': {
        category: 'data',
        description: 'Removable tag that emits `remove`.'
    },
    'progress': {
        category: 'data',
        description: 'Progress bar (`v-model` 0 to `max`) with an `indeterminate` mode.'
    },
    'progress-component': {
        category: 'data',
        description: 'Progress bar with a title, a value/max readout, and optional bottom labels.'
    },
    'skeleton': {
        category: 'data',
        description: 'Shimmering loading placeholder. Size and shape it with classes.'
    },
    'separator': {
        category: 'data',
        description: 'Horizontal or vertical divider.'
    },
    'scroll-area': {
        category: 'data',
        description: 'Scroll container with custom scrollbars.'
    },
    'card-grid': {
        category: 'data',
        description: 'Responsive grid of cards with built-in loading, empty, and load-more states. Render each item in the `card` slot.'
    },

    /*********************** Navigation ***********************/

    'tabs': {
        category: 'navigation',
        description: 'Tabs with a sliding active indicator (horizontal or vertical) and animated panels.',
        example: `
<Tabs default-value="overview">
    <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">...</TabsContent>
    <TabsContent value="settings">...</TabsContent>
</Tabs>`
    },
    'stepper': {
        category: 'navigation',
        description: 'Step indicator for wizards. `SimpleStepper` renders a whole stepper from a `steps` array; the other parts compose custom layouts.',
        example: `
<SimpleStepper v-model="step" :steps="[{ title: 'Account' }, { title: 'Billing', description: 'Pick a plan' }, { title: 'Launch' }]" />`
    },
    'pagination': {
        category: 'navigation',
        description: 'Pagination controls. `SimplePagination` covers the common case; the parts compose custom layouts.',
        example: `
<SimplePagination v-model:page="page" :total="240" :items-per-page="20" />`
    },
    'accordion': {
        category: 'navigation',
        description: 'Single expandable card with a title and optional icon. Uncontrolled (`initially-expanded`) or controlled (`v-model:open`).',
        example: `
<Accordion title="What is UI Vintage?" :icon="InformationCircleIcon" initially-expanded>
    <p>A source-published Nuxt component library.</p>
</Accordion>`
    },
    'collapsible': {
        category: 'navigation',
        description: 'Show or hide content with an animated height (`v-model:open`).'
    },
    'breadcrumb': {
        category: 'navigation',
        description: 'Breadcrumb trail parts: list, item, link, current page, separator, and ellipsis.'
    },
    'sidebar': {
        category: 'navigation',
        description: 'Low-level sidebar system (provider, collapsible desktop sidebar, mobile sheet, menus, `useSidebar`). Prefer `dashboard-shell`, which composes it.'
    },

    /*********************** Overlays ***********************/

    'dialog': {
        category: 'overlays',
        description: 'Modal dialog. `DialogContent` accepts `show-close-button`; use `DialogScrollContent` for long content.',
        example: `
<Dialog>
    <DialogTrigger as-child>
        <Button>Edit profile</Button>
    </DialogTrigger>
    <DialogContent show-close-button>
        <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile.</DialogDescription>
        </DialogHeader>
        ...
        <DialogFooter>
            <DialogClose as-child><Button variant="secondary">Cancel</Button></DialogClose>
        </DialogFooter>
    </DialogContent>
</Dialog>`
    },
    'alert-dialog': {
        category: 'overlays',
        description: 'Modal that requires an explicit choice. For simple confirmations prefer `showConfirmDialog` from `confirm-dialog`.'
    },
    'sheet': {
        category: 'overlays',
        description: 'Side panel that slides in from `top`, `right`, `bottom`, or `left`.',
        example: `
<Sheet>
    <SheetTrigger as-child><Button variant="secondary">Settings</Button></SheetTrigger>
    <SheetContent side="right">
        <SheetHeader>
            <SheetTitle>Settings</SheetTitle>
            <SheetDescription>Workspace preferences.</SheetDescription>
        </SheetHeader>
    </SheetContent>
</Sheet>`
    },
    'popover': {
        category: 'overlays',
        description: 'Floating panel anchored to a trigger.'
    },
    'tooltip': {
        category: 'overlays',
        description: 'Hover and focus hint. Wrap the app (or layout) in `TooltipProvider` once; `DashboardShell` already provides one.',
        example: `
<Tooltip>
    <TooltipTrigger as-child><Button variant="ghost" size="icon">?</Button></TooltipTrigger>
    <TooltipContent side="right">Helpful hint</TooltipContent>
</Tooltip>`
    },
    'hover-card': {
        category: 'overlays',
        description: 'Rich preview shown on hover (for example a user profile behind a link).'
    },
    'command': {
        category: 'overlays',
        description: 'Command palette list with filtering. A string `value` on `CommandItem` adds search keywords. Use `CommandDialog` for a modal palette.',
        example: `
<CommandDialog v-model:open="open">
    <CommandInput placeholder="Search..." />
    <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Pages">
            <CommandItem value="settings preferences" @select="go('/settings')">Settings</CommandItem>
        </CommandGroup>
    </CommandList>
</CommandDialog>`
    },

    /*********************** Feedback ***********************/

    'message-toast': {
        category: 'feedback',
        description: 'Stacked toasts (hover to expand and pause, swipe to dismiss) with titles and actions. `showMessageToast` returns an id for `closeMessageToast(id)`; `duration: 0` keeps a toast open.',
        exampleLang: 'ts',
        example: `
showMessageToast({ title: 'Saved', message: 'Your changes are live.', type: 'success' });

const id = showMessageToast({ message: 'Publishing...', type: 'info', duration: 0, dismissible: false });
closeMessageToast(id);`
    },
    'confirm-dialog': {
        category: 'feedback',
        description: 'Promise-based confirmation dialog. Resolves to `true` or `false`; an async `onConfirm` shows a spinner on the confirm button until it settles.',
        exampleLang: 'ts',
        example: `
const confirmed = await showConfirmDialog({
    title: 'Delete project?',
    message: 'This action cannot be undone.',
    confirmText: 'Delete',
    confirmButtonType: 'red',
    onConfirm: () => api.deleteProject(id)
});`
    },
    'message-dialog': {
        category: 'feedback',
        description: 'Promise-based message dialog for success, info, warning, and error messages.',
        exampleLang: 'ts',
        example: `
await showMessageDialog({ type: 'success', message: 'Your account is verified.' });`
    },
    'busy-indicator': {
        category: 'feedback',
        description: 'Global busy overlay controlled with `setBusy(show, options)`.',
        exampleLang: 'ts',
        example: `
setBusy(true, { label: 'Generating report...' });
await generateReport();
setBusy(false);`
    },
    'busy': {
        category: 'feedback',
        description: 'Busy overlay component for local use (`show` prop). For a global overlay use `busy-indicator`.'
    },
    'spinner': {
        category: 'feedback',
        description: 'Loading spinner in five sizes; inherits the text color.'
    },
    'alert': {
        category: 'feedback',
        description: 'Inline callout in five tones. Put an icon first, then `AlertTitle` and `AlertDescription`.',
        example: `
<Alert color="yellow">
    <HugeiconsIcon :icon="Alert02Icon" />
    <AlertTitle>Approaching limit</AlertTitle>
    <AlertDescription>You have used 92% of your build minutes.</AlertDescription>
</Alert>`
    },
    'empty-state-card': {
        category: 'feedback',
        description: 'Empty state with an icon, title, description, and an `action` slot. Falls back to localized default copy.'
    },
    'loading-state-card': {
        category: 'feedback',
        description: 'Loading state card with a spinning icon and localized default copy.'
    },

    /*********************** Layouts ***********************/

    'dashboard-shell': {
        category: 'layout',
        description: 'Complete dashboard layout: collapsible sidebar built from `sidebar-sections`, mobile sheet, sticky topbar, and grid background. Pass `NuxtLink` as `sidebar-link-component` for client-side navigation.',
        example: `
<DashboardShell title="Projects" :sidebar-sections="sections" :sidebar-link-component="NuxtLink">
    <template #topbar-trailing>
        <ThemeSelector />
    </template>
    <slot />
</DashboardShell>`
    },
    'page-header': {
        category: 'layout',
        description: 'Page title row with an optional actions slot, in three sizes.'
    },
    'error-page': {
        category: 'layout',
        description: 'Branded 404/500 page for `error.vue`, with `toolbar` and `brand` slots and an `action` event.'
    },
    'background-grid': {
        category: 'layout',
        description: 'Decorative grid background for app shells.'
    },
    'landing': {
        category: 'layout',
        description: 'All landing layout parts in one entry point (shell, navbar, content, footer).'
    },
    'landing-shell': {
        category: 'layout',
        description: 'Landing page frame with `navbar`, `content`, and `footer` slots.'
    },
    'landing-navbar': {
        category: 'layout',
        description: 'Landing navbar with app name or logo, an optional reading progress bar, and a `right` slot.'
    },
    'landing-content': {
        category: 'layout',
        description: 'Centered content column for landing and blog pages.'
    },
    'landing-footer': {
        category: 'layout',
        description: 'Landing footer with link sections, app description, and author credit.'
    },
    'theme-selector': {
        category: 'layout',
        description: 'Light, dark, and auto theme menu with a circular reveal (View Transitions API). `applyThemeWithTransition` switches themes from your own controls.',
        example: `
<ThemeSelector />`
    },
    'language-selector': {
        category: 'layout',
        description: 'Language menu with flags. Pass the locale codes; handle `select` to call `setLocale`.'
    },
    'language-flag': {
        category: 'layout',
        description: 'Flag icons for the supported locales.'
    },

    /*********************** Content ***********************/

    'blog': {
        category: 'content',
        description: 'Blog building blocks: header carousel, post cards and lists, categories, tags, table of contents, reading progress, FAQ, share sidebar, and the content renderer.'
    },
    'content': {
        category: 'content',
        description: 'Prose components for Nuxt Content (MDC): code blocks highlighted with shiki, terminals, lists, tables, flows, and dividers.'
    },

    /*********************** Utilities ***********************/

    'utils': {
        category: 'utilities',
        description: 'Class merging (`cn`) and formatting helpers.'
    },
    'common-types': {
        category: 'utilities',
        description: 'Shared types used in component props.'
    }
};