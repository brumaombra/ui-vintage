<script setup lang="ts">
import { ref } from 'vue';
import { BellDotIcon, Cancel01Icon, CheckmarkCircle02Icon, DashboardSquare01Icon, InformationCircleIcon, RefreshIcon, SaveIcon, SlidersHorizontalIcon } from '@hugeicons/core-free-icons';
import { setBusy } from '@brumaombra/ui-vintage/busy-indicator';
import { Button } from '@brumaombra/ui-vintage/button';
import { showConfirmDialog } from '@brumaombra/ui-vintage/confirm-dialog';
import { DashboardShell } from '@brumaombra/ui-vintage/dashboard-shell';
import { showMessageDialog } from '@brumaombra/ui-vintage/message-dialog';
import { TooltipProvider } from '@brumaombra/ui-vintage/tooltip';
import CurrentStateCard from '../components/CurrentStateCard.vue';
import BadgePreviewCard from '../components/BadgePreviewCard.vue';
import DialogPreviewCard from '../components/DialogPreviewCard.vue';
import InputStatesCard from '../components/InputStatesCard.vue';
import LoadingPreviewCard from '../components/LoadingPreviewCard.vue';
import MessageToastPreviewCard from '../components/MessageToastPreviewCard.vue';
import PrimaryActionsCard from '../components/PrimaryActionsCard.vue';
import SurfaceVariantsCard from '../components/SurfaceVariantsCard.vue';
import DemoToolbar from '../components/DemoToolbar.vue';

// Sidebar navigation structure
const sidebarSections = [{
    id: 'overview',
    label: 'Overview',
    items: [
        { id: 'components', label: 'Components', description: 'Interactive primitives and surfaces', icon: DashboardSquare01Icon, active: true },
        { id: 'feedback', label: 'Feedback', description: 'Dialogs, alerts, and busy states', icon: BellDotIcon },
        { id: 'controls', label: 'Controls', description: 'Inputs, selects, sliders, and toggles', icon: SlidersHorizontalIcon }
    ]
}];

// Various state variables
const name = ref('Satoshi Nakamoto');
const network = ref('bitcoin');
const alertsEnabled = ref(true);
const confidence = ref(72);

// Open dialogs and trigger busy state for demo purposes
const handleConfirmDemo = async () => {
    // Show a confirm dialog
    const confirmed = await showConfirmDialog({
        title: 'Publish changes?',
        icon: SaveIcon,
        message: 'This confirms the action flow and the dialog animation using the current theme styles.',
        confirmText: 'Publish',
        cancelText: 'Review',
        confirmButtonIcon: SaveIcon,
        cancelButtonIcon: Cancel01Icon
    });

    // If confirmed, show a follow-up message dialog
    if (confirmed) {
        await showMessageDialog({
            type: 'success',
            icon: CheckmarkCircle02Icon,
            title: 'Published',
            message: 'The confirm dialog resolved successfully and triggered a follow-up message dialog.',
            closeText: 'Continue',
            closeButtonIcon: CheckmarkCircle02Icon
        });
    }
};

// Simulate a busy state and then show a message dialog
const handleBusyDemo = async () => {
    // Show a busy indicator for 1 second
    setBusy(true, { label: 'Syncing demo data...' });
    await new Promise(resolve => window.setTimeout(resolve, 1000));

    // Hide the busy indicator and show a message dialog
    setBusy(false);
    await showMessageDialog({
        type: 'info',
        icon: RefreshIcon,
        title: 'Sync complete',
        message: 'The busy indicator was displayed using the shared global overlay.',
        closeButtonIcon: Cancel01Icon
    });
};

// Show an informational dialog about the demo screen
const handleInfoDemo = async () => {
    await showMessageDialog({
        type: 'info',
        icon: InformationCircleIcon,
        title: 'Demo screen',
        message: 'This screen is meant to preview the core components with realistic spacing and interactions.',
        closeText: 'Got it',
        closeButtonIcon: Cancel01Icon
    });
};
</script>

<template>
    <TooltipProvider>
        <!-- Main dashboard shell container with a topbar and sidebar -->
        <DashboardShell title="Theme Vintage Demo" description="A compact showcase of the current component library." :sidebar-sections="sidebarSections">
            <!-- Custom sidebar header slot -->
            <template #sidebar-header>
                <div class="hidden items-center gap-2 sm:flex">
                    <!-- App name -->
                    <span class="rounded border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground uppercase tracking-[0.16em]">
                        Demo
                    </span>

                    <!-- Quick intro button -->
                    <Button variant="secondary" size="sm" @click="handleInfoDemo">
                        Quick Intro
                    </Button>
                </div>
            </template>

            <!-- Main content area -->
            <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                <!-- Demo controls card spanning multiple columns -->
                <div class="lg:col-span-2 xl:col-span-3">
                    <DemoToolbar />
                </div>

                <!-- Primary actions card with event handlers for demo interactions -->
                <PrimaryActionsCard
                    class="lg:col-span-2 xl:col-span-2"
                    @confirm-demo="handleConfirmDemo"
                    @busy-demo="handleBusyDemo"
                    @info-demo="handleInfoDemo"
                />

                <!-- Input states card with two-way bindings for form controls -->
                <InputStatesCard
                    :name="name"
                    :network="network"
                    :alerts-enabled="alertsEnabled"
                    :confidence="confidence"
                    @update:name="name = $event"
                    @update:network="network = $event"
                    @update:alerts-enabled="alertsEnabled = $event"
                    @update:confidence="confidence = $event"
                />

                <!-- Surface variants card -->
                <SurfaceVariantsCard />

                <!-- Badge preview card -->
                <BadgePreviewCard />

                <!-- Dialog preview card -->
                <DialogPreviewCard />

                <!-- Loading preview card -->
                <LoadingPreviewCard />

                <!-- Message toast preview card -->
                <MessageToastPreviewCard />

                <!-- Current state card -->
                <CurrentStateCard
                    :name="name"
                    :network="network"
                    :alerts-enabled="alertsEnabled"
                />
            </div>
        </DashboardShell>
    </TooltipProvider>
</template>