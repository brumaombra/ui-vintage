<script setup lang="ts">
import { ref } from 'vue';
import DemoToolbar from './DemoToolbar.vue';
import {
    BellRing,
    CheckCircle2,
    LayoutDashboard,
    MousePointerClick,
    SlidersHorizontal,
    Sparkles,
} from 'lucide-vue-next';
import {
    Alert,
    AlertDescription,
    AlertTitle,
    BusyIndicator,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    ConfirmDialog,
    DashboardShell,
    Input,
    Label,
    MessageDialog,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Select,
    SelectContent,
    SelectItem,
    SelectItemText,
    SelectTrigger,
    SelectValue,
    Skeleton,
    Slider,
    Switch,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    setBusy,
    showConfirmDialog,
    showMessageDialog,
} from 'theme-vintage';

const sidebarSections = [
    {
        id: 'overview',
        label: 'Overview',
        items: [
            { id: 'components', label: 'Components', description: 'Interactive primitives and surfaces', icon: LayoutDashboard, active: true },
            { id: 'feedback', label: 'Feedback', description: 'Dialogs, alerts, and busy states', icon: BellRing },
            { id: 'controls', label: 'Controls', description: 'Inputs, selects, sliders, and toggles', icon: SlidersHorizontal },
        ],
    },
];

const name = ref('Satoshi Nakamoto');
const network = ref('bitcoin');
const alertsEnabled = ref(true);
const confidence = ref([72]);

const handleConfirmDemo = async () => {
    const confirmed = await showConfirmDialog({
        title: 'Publish changes?',
        message: 'This confirms the action flow and the dialog animation using the current theme styles.',
        confirmText: 'Publish',
        cancelText: 'Review',
    });

    if (confirmed) {
        await showMessageDialog({
            type: 'Success',
            title: 'Published',
            message: 'The confirm dialog resolved successfully and triggered a follow-up message dialog.',
            closeText: 'Continue',
        });
    }
};

const handleBusyDemo = async () => {
    setBusy(true, { label: 'Syncing demo data...' });

    await new Promise((resolve) => window.setTimeout(resolve, 1200));

    setBusy(false);
    await showMessageDialog({
        type: 'Info',
        title: 'Sync complete',
        message: 'The busy indicator was displayed using the shared global overlay.',
    });
};

const handleInfoDemo = async () => {
    await showMessageDialog({
        type: 'Info',
        title: 'Demo screen',
        message: 'This screen is meant to preview the core components with realistic spacing and interactions.',
        closeText: 'Got it',
    });
};
</script>

<template>
    <TooltipProvider>
        <DashboardShell title="Theme Vintage Demo" description="A compact showcase of the current component library." :sidebar-sections="sidebarSections" content-container-class="max-w-7xl">
            <template #topbar-trailing>
                <div class="hidden items-center gap-2 sm:flex">
                    <span class="rounded border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground uppercase tracking-[0.16em]">
                        Demo
                    </span>
                    <Button variant="outline" size="sm" @click="handleInfoDemo">
                        Quick Intro
                    </Button>
                </div>
            </template>

            <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                <div class="lg:col-span-2 xl:col-span-3">
                    <DemoToolbar />
                </div>

                <Card class="lg:col-span-2 xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Primary Actions</CardTitle>
                        <CardDescription>
                            Buttons, tooltips, popovers, and dialog flows in one place.
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-6">
                        <div class="flex flex-wrap gap-3">
                            <Button @click="handleConfirmDemo">
                                <Sparkles class="size-4" />
                                Confirm Flow
                            </Button>

                            <Button variant="outline" @click="handleBusyDemo">
                                <MousePointerClick class="size-4" />
                                Busy Overlay
                            </Button>

                            <Tooltip>
                                <TooltipTrigger as-child>
                                    <Button variant="ghost">Tooltip</Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Hover states, focus handling, and spacing can be checked here.
                                </TooltipContent>
                            </Tooltip>

                            <Popover>
                                <PopoverTrigger as-child>
                                    <Button variant="outline">Open Popover</Button>
                                </PopoverTrigger>
                                <PopoverContent class="space-y-3">
                                    <div>
                                        <div class="text-sm font-semibold">Popover Surface</div>
                                        <p class="mt-1 text-xs leading-5 text-muted-foreground">
                                            Useful for checking border, background, and motion on floating surfaces.
                                        </p>
                                    </div>
                                    <Button size="sm" class="w-full">Take Action</Button>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <Alert>
                            <CheckCircle2 class="size-4" />
                            <AlertTitle>Theme tokens are active</AlertTitle>
                            <AlertDescription>
                                Cards, overlays, and controls in this screen intentionally mix semantic tokens and custom component states.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                    <CardFooter class="justify-between border-t border-border">
                        <span class="text-xs text-muted-foreground">Use this panel for interaction checks.</span>
                        <Button variant="link" size="sm" @click="handleInfoDemo">Open message dialog</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Input States</CardTitle>
                        <CardDescription>
                            Small form controls for spacing, borders, and typography checks.
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-5">
                        <div class="space-y-2">
                            <Label for="demo-name">Display name</Label>
                            <Input id="demo-name" v-model="name" placeholder="Enter a display name" />
                        </div>

                        <div class="space-y-2">
                            <Label>Network</Label>
                            <Select v-model="network">
                                <SelectTrigger class="w-full">
                                    <SelectValue placeholder="Choose a network" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bitcoin">
                                        <SelectItemText>Bitcoin</SelectItemText>
                                    </SelectItem>
                                    <SelectItem value="kaspa">
                                        <SelectItemText>Kaspa</SelectItemText>
                                    </SelectItem>
                                    <SelectItem value="litecoin">
                                        <SelectItemText>Litecoin</SelectItemText>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="flex items-center justify-between gap-4 rounded border border-border bg-card px-4 py-3">
                            <div>
                                <div class="text-sm font-medium">Enable alerts</div>
                                <div class="text-xs text-muted-foreground">Preview switch track and thumb styling.</div>
                            </div>
                            <Switch v-model:model-value="alertsEnabled" />
                        </div>

                        <div class="space-y-3 rounded border border-border bg-card px-4 py-4">
                            <div class="flex items-center justify-between gap-3">
                                <div>
                                    <div class="text-sm font-medium">Confidence</div>
                                    <div class="text-xs text-muted-foreground">Current value: {{ confidence[0] }}%</div>
                                </div>
                                <span class="rounded border border-border bg-background px-2 py-1 text-xs font-medium">{{ confidence[0] }}%</span>
                            </div>
                            <Slider v-model:model-value="confidence" :max="100" :step="1" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Surface Variants</CardTitle>
                        <CardDescription>
                            Useful for checking border rendering and nested spacing.
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="grid gap-3 sm:grid-cols-2">
                        <div class="rounded border border-border bg-card px-4 py-4">
                            <div class="text-sm font-semibold">Nested Card</div>
                            <p class="mt-1 text-xs leading-5 text-muted-foreground">The semantic border color should remain stable inside another card.</p>
                        </div>
                        <div class="rounded border border-border bg-popover px-4 py-4 text-popover-foreground">
                            <div class="text-sm font-semibold">Floating Surface</div>
                            <p class="mt-1 text-xs leading-5 text-muted-foreground">This mirrors popover/select background tokens without opening an overlay.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Loading Preview</CardTitle>
                        <CardDescription>
                            Skeletons and compact placeholders for asynchronous states.
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-3">
                        <Skeleton class="h-5 w-32 rounded-md" />
                        <Skeleton class="h-4 w-full rounded-md" />
                        <Skeleton class="h-4 w-5/6 rounded-md" />
                        <Skeleton class="h-28 w-full rounded-xl" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Current State</CardTitle>
                        <CardDescription>
                            Quick values from the live demo controls.
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-3 text-sm">
                        <div class="flex items-center justify-between gap-3 rounded border border-border bg-background px-3 py-2">
                            <span class="text-muted-foreground">Name</span>
                            <span class="truncate font-medium">{{ name }}</span>
                        </div>
                        <div class="flex items-center justify-between gap-3 rounded border border-border bg-background px-3 py-2">
                            <span class="text-muted-foreground">Network</span>
                            <span class="font-medium capitalize">{{ network }}</span>
                        </div>
                        <div class="flex items-center justify-between gap-3 rounded border border-border bg-background px-3 py-2">
                            <span class="text-muted-foreground">Alerts</span>
                            <span class="font-medium">{{ alertsEnabled ? 'Enabled' : 'Disabled' }}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <ConfirmDialog />
            <MessageDialog />
            <BusyIndicator />
        </DashboardShell>
    </TooltipProvider>
</template>