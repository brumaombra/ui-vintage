<script setup>
import { ref } from 'vue';
import { Cancel01Icon, CheckmarkCircle02Icon, InformationCircleIcon, RefreshIcon, SaveIcon } from '@hugeicons/core-free-icons';
import { setBusy } from '@brumaombra/ui-vintage/busy-indicator';
import { showConfirmDialog } from '@brumaombra/ui-vintage/confirm-dialog';
import { showMessageDialog } from '@brumaombra/ui-vintage/message-dialog';
import CurrentStateCard from '../components/CurrentStateCard.vue';
import BadgePreviewCard from '../components/BadgePreviewCard.vue';
import DialogPreviewCard from '../components/DialogPreviewCard.vue';
import InputStatesCard from '../components/InputStatesCard.vue';
import AccordionPreviewCard from '../components/AccordionPreviewCard.vue';
import TabsPreviewCard from '../components/TabsPreviewCard.vue';
import LoadingPreviewCard from '../components/LoadingPreviewCard.vue';
import MessageToastPreviewCard from '../components/MessageToastPreviewCard.vue';
import PrimaryActionsCard from '../components/PrimaryActionsCard.vue';
import SelectContentCard from '../components/SelectContentCard.vue';
import SurfaceVariantsCard from '../components/SurfaceVariantsCard.vue';
import DemoToolbar from '../components/DemoToolbar.vue';

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

// Define page metadata
definePageMeta({
    layout: 'dashboard'
});
</script>

<template>
    <!-- Main content area -->
    <div class="grid items-start gap-4 lg:grid-cols-2 xl:grid-cols-3">
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

        <!-- Current state card with values from the live demo controls -->
        <CurrentStateCard
            :name="name"
            :network="network"
            :alerts-enabled="alertsEnabled"
        />

        <!-- Accordion preview card -->
        <AccordionPreviewCard />

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

        <!-- Select content card -->
        <SelectContentCard />

        <!-- Tabs preview card -->
        <TabsPreviewCard />

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
    </div>
</template>