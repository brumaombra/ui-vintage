import { DashboardSquare01Icon, Cursor01Icon, InputTextIcon, Layers01Icon, LayoutTwoColumnIcon, Navigation03Icon, News01Icon, Notification01Icon, PaintBoardIcon, Table01Icon } from '@hugeicons/core-free-icons';

export interface DemoSectionLink {
    id: string;
    title: string;
    keywords?: string;
}

export interface DemoPage {
    id: string;
    label: string;
    description: string;
    to: string;
    icon: typeof DashboardSquare01Icon;
    sections: DemoSectionLink[];
}

export interface DemoNavigationGroup {
    id: string;
    label: string;
    items: DemoPage[];
}

// Single source of truth for the sidebar, the topbar title, and the command palette
export const demoNavigation: DemoNavigationGroup[] = [{
    id: 'start',
    label: 'Getting started',
    items: [{
        id: 'overview',
        label: 'Overview',
        description: 'Live preview and highlights',
        to: '/',
        icon: DashboardSquare01Icon,
        sections: [
            { id: 'live-preview', title: 'Live app preview', keywords: 'dashboard example' },
            { id: 'explore', title: 'Explore the library', keywords: 'categories' }
        ]
    }, {
        id: 'foundations',
        label: 'Foundations',
        description: 'Tokens, motion, elevation',
        to: '/foundations',
        icon: PaintBoardIcon,
        sections: [
            { id: 'colors', title: 'Color tokens', keywords: 'palette theme css variables' },
            { id: 'motion', title: 'Motion curves', keywords: 'easing spring animation' },
            { id: 'elevation', title: 'Elevation', keywords: 'shadow' },
            { id: 'typography', title: 'Typography', keywords: 'font text' }
        ]
    }]
}, {
    id: 'components',
    label: 'Components',
    items: [{
        id: 'actions',
        label: 'Actions',
        description: 'Buttons, menus, toggles',
        to: '/components/actions',
        icon: Cursor01Icon,
        sections: [
            { id: 'button', title: 'Button', keywords: 'loading variants sizes' },
            { id: 'toggle-group', title: 'Toggle group', keywords: 'segmented control toggle' },
            { id: 'dropdown-menu', title: 'Dropdown menu', keywords: 'context actions submenu' },
            { id: 'kbd', title: 'Kbd', keywords: 'keyboard shortcut' }
        ]
    }, {
        id: 'forms',
        label: 'Forms',
        description: 'Inputs, pickers, uploads',
        to: '/components/forms',
        icon: InputTextIcon,
        sections: [
            { id: 'text-fields', title: 'Text fields', keywords: 'input textarea field validation' },
            { id: 'select', title: 'Select', keywords: 'dropdown options' },
            { id: 'combobox', title: 'Combobox', keywords: 'autocomplete search multiple' },
            { id: 'checkbox-radio', title: 'Checkbox & radio', keywords: 'radio group card' },
            { id: 'switch-slider', title: 'Switch & slider', keywords: 'toggle range' },
            { id: 'number-field', title: 'Number field', keywords: 'stepper quantity' },
            { id: 'pin-input', title: 'PIN input', keywords: 'otp code verification' },
            { id: 'tags-input', title: 'Tags input', keywords: 'chips' },
            { id: 'date-time', title: 'Date & time', keywords: 'calendar date picker time' },
            { id: 'file-dropzone', title: 'File dropzone', keywords: 'upload drag drop' }
        ]
    }, {
        id: 'data-display',
        label: 'Data display',
        description: 'Tables, stats, avatars',
        to: '/components/data-display',
        icon: Table01Icon,
        sections: [
            { id: 'data-table', title: 'Data table', keywords: 'sort select rows grid' },
            { id: 'stats', title: 'Stats & numbers', keywords: 'single value card animated number kpi' },
            { id: 'cards', title: 'Cards', keywords: 'interactive surface info card' },
            { id: 'avatar', title: 'Avatar', keywords: 'user profile group status' },
            { id: 'badges-chips', title: 'Badges & chips', keywords: 'tag label status' },
            { id: 'progress-skeleton', title: 'Progress & skeleton', keywords: 'loading bar placeholder' },
            { id: 'data-list', title: 'Data list', keywords: 'key value description' }
        ]
    }, {
        id: 'navigation',
        label: 'Navigation',
        description: 'Tabs, steps, pagination',
        to: '/components/navigation',
        icon: Navigation03Icon,
        sections: [
            { id: 'tabs', title: 'Tabs', keywords: 'indicator' },
            { id: 'stepper', title: 'Stepper', keywords: 'wizard steps progress' },
            { id: 'pagination', title: 'Pagination', keywords: 'pages' },
            { id: 'accordion', title: 'Accordion & collapsible', keywords: 'expand disclosure faq' },
            { id: 'breadcrumb', title: 'Breadcrumb', keywords: 'path trail' }
        ]
    }, {
        id: 'overlays',
        label: 'Overlays',
        description: 'Dialogs, sheets, popovers',
        to: '/components/overlays',
        icon: Layers01Icon,
        sections: [
            { id: 'dialog', title: 'Dialog', keywords: 'modal' },
            { id: 'sheet', title: 'Sheet', keywords: 'drawer side panel' },
            { id: 'popover-tooltip', title: 'Popover & tooltip', keywords: 'floating hint' },
            { id: 'hover-card', title: 'Hover card', keywords: 'preview profile' },
            { id: 'command', title: 'Command palette', keywords: 'search cmdk spotlight' }
        ]
    }, {
        id: 'feedback',
        label: 'Feedback',
        description: 'Toasts, alerts, states',
        to: '/components/feedback',
        icon: Notification01Icon,
        sections: [
            { id: 'toasts', title: 'Toasts', keywords: 'notification snackbar message' },
            { id: 'dialog-flows', title: 'Dialog flows', keywords: 'confirm message promise' },
            { id: 'busy', title: 'Busy overlay & spinner', keywords: 'loading' },
            { id: 'alerts', title: 'Alerts', keywords: 'callout banner' },
            { id: 'cookie-consent', title: 'Cookie consent', keywords: 'gdpr privacy banner' },
            { id: 'states', title: 'Empty & loading states', keywords: 'placeholder' }
        ]
    }]
}, {
    id: 'patterns',
    label: 'Patterns',
    items: [{
        id: 'layouts',
        label: 'Layouts',
        description: 'Shells, headers, grids',
        to: '/layouts',
        icon: LayoutTwoColumnIcon,
        sections: [
            { id: 'page-header', title: 'Page header', keywords: 'title' },
            { id: 'card-grid', title: 'Card grid', keywords: 'load more list' },
            { id: 'theme-logo', title: 'Theme-aware logo', keywords: 'dark mode brand image' },
            { id: 'shells', title: 'Application shells', keywords: 'dashboard landing sidebar error page' }
        ]
    }, {
        id: 'blog',
        label: 'Blog demo',
        description: 'Landing shell + content',
        to: '/blog',
        icon: News01Icon,
        sections: []
    }]
}];

// Flat list of every page
export const demoPages = demoNavigation.flatMap(group => group.items);

// Find the page that matches a route path
export const findDemoPage = (path: string) => {
    const normalizedPath = path.replace(/\/+$/, '') || '/';
    return demoPages.find(page => page.to === normalizedPath) ?? null;
};