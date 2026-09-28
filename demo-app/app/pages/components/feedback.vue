<script setup lang="ts">
import { Alert02Icon, CheckmarkCircle02Icon, Delete02Icon, InformationCircleIcon, Notification01Icon, PlusSignIcon, RefreshIcon, Rocket01Icon, SaveIcon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Alert, AlertDescription, AlertTitle } from '@brumaombra/ui-vintage/alert';
import { setBusy } from '@brumaombra/ui-vintage/busy-indicator';
import { Button } from '@brumaombra/ui-vintage/button';
import { showConfirmDialog } from '@brumaombra/ui-vintage/confirm-dialog';
import { EmptyStateCard } from '@brumaombra/ui-vintage/empty-state-card';
import { LoadingStateCard } from '@brumaombra/ui-vintage/loading-state-card';
import { showMessageDialog } from '@brumaombra/ui-vintage/message-dialog';
import { closeMessageToast, showMessageToast } from '@brumaombra/ui-vintage/message-toast';
import type { MessageToastType } from '@brumaombra/ui-vintage/message-toast';
import { Spinner } from '@brumaombra/ui-vintage/spinner';
import DemoPageHeader from '~/components/demo/DemoPageHeader.vue';
import DemoSection from '~/components/demo/DemoSection.vue';

definePageMeta({ layout: 'dashboard' });

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Toast samples for each type
const toastSamples: Record<MessageToastType, { title: string; message: string }> = {
    success: { title: 'Payment received', message: '€249.00 from Acme Inc. was added to your balance.' },
    info: { title: 'New version available', message: 'Reload to get the latest improvements.' },
    warning: { title: 'Storage almost full', message: 'You have used 92% of your 50 GB plan.' },
    error: { title: 'Sync failed', message: 'We could not reach the server. Retrying in 30s.' }
};

// Show a toast of the given type
const handleToast = (type: MessageToastType) => {
    showMessageToast({ type, ...toastSamples[type] });
};

// Show a toast with an undo action
const handleUndoToast = () => {
    showMessageToast({
        message: 'Conversation moved to archive.',
        type: 'info',
        action: { label: 'Undo', onClick: () => showMessageToast({ message: 'Conversation restored.', type: 'success', duration: 2500 }) }
    });
};

// Stack several toasts to show the hover-to-expand behavior
const handleBurst = async () => {
    const types: MessageToastType[] = ['info', 'success', 'warning', 'success', 'error'];
    for (const [index, type] of types.entries()) {
        showMessageToast({ type, title: `Event #${index + 1}`, message: toastSamples[type].message, duration: 8000 });
        await wait(140);
    }
};

// Replace a pending toast with the result of an async task
const handlePromiseToast = async () => {
    const pendingId = showMessageToast({ title: 'Publishing…', message: 'Uploading 24 assets to the CDN.', type: 'info', duration: 0, dismissible: false });
    await wait(1800);
    closeMessageToast(pendingId);
    showMessageToast({ title: 'Published', message: 'Your site is live at acme.vintage.app', type: 'success' });
};

// Confirm with an async handler (the confirm button shows a spinner)
const handleConfirm = async () => {
    const confirmed = await showConfirmDialog({
        title: 'Publish changes?',
        icon: SaveIcon,
        message: 'Your changes will be visible to everyone with access to this workspace.',
        confirmText: 'Publish',
        confirmButtonIcon: Rocket01Icon,
        onConfirm: () => wait(1200)
    });
    if (confirmed) showMessageToast({ message: 'Changes published.', type: 'success' });
};

// Destructive confirm
const handleDestructiveConfirm = async () => {
    const confirmed = await showConfirmDialog({
        title: 'Delete 3 invoices?',
        icon: Delete02Icon,
        message: 'Deleted invoices cannot be recovered.',
        confirmText: 'Delete',
        confirmButtonType: 'red',
        confirmButtonIcon: Delete02Icon
    });
    showMessageToast(confirmed ? { message: '3 invoices deleted.', type: 'error' } : { message: 'Nothing was deleted.', type: 'info', duration: 2000 });
};

// Message dialogs of each type
const handleMessage = (type: 'success' | 'info' | 'warning' | 'error') => {
    const copy = {
        success: 'Your account is verified and ready to go.',
        info: 'Maintenance is scheduled for Sunday at 02:00 UTC.',
        warning: 'Your API key expires in 3 days.',
        error: 'The upload failed because the file is larger than 50 MB.'
    };
    void showMessageDialog({ type, message: copy[type] });
};

// Global busy overlay
const handleBusy = async () => {
    setBusy(true, { label: 'Generating report…' });
    await wait(1600);
    setBusy(false);
    showMessageToast({ message: 'Report ready to download.', type: 'success' });
};

const toastCode = `import { showMessageToast, closeMessageToast } from '@brumaombra/ui-vintage/message-toast';

showMessageToast({ title: 'Payment received', message: '€249.00 from Acme Inc.', type: 'success' });

// Actions, persistent toasts, and manual dismissal
const id = showMessageToast({ message: 'Publishing…', type: 'info', duration: 0, dismissible: false });
closeMessageToast(id);`;

const dialogCode = `const confirmed = await showConfirmDialog({
    title: 'Publish changes?',
    message: 'Your changes will be visible to everyone.',
    onConfirm: () => api.publish() // the button spins while this runs
});`;
</script>

<template>
    <div class="flex flex-col gap-12">
        <DemoPageHeader eyebrow="Components" title="Feedback" description="Stacked toasts you can hover and swipe, promise-based dialogs with async handlers, and states for every loading moment." :icon="Notification01Icon" />

        <!-- Toasts -->
        <DemoSection id="toasts" title="Toasts" badge="Updated" description="Toasts stack with depth, expand on hover (pausing their countdown), and can be swiped away. Actions and persistent toasts are supported." :code="toastCode" language="ts">
            <div class="flex flex-col gap-6">
                <div class="flex flex-wrap gap-3">
                    <Button variant="green" @click="handleToast('success')">Success</Button>
                    <Button variant="blue" @click="handleToast('info')">Info</Button>
                    <Button variant="yellow" @click="handleToast('warning')">Warning</Button>
                    <Button variant="red" @click="handleToast('error')">Error</Button>
                </div>
                <div class="flex flex-wrap gap-3">
                    <Button variant="secondary" @click="handleUndoToast">With action</Button>
                    <Button variant="secondary" @click="handlePromiseToast">Async task</Button>
                    <Button @click="handleBurst">
                        <HugeiconsIcon :icon="Notification01Icon" />
                        Burst of 5
                    </Button>
                </div>
                <p class="text-xs text-muted-foreground">Tip: hover the stack in the bottom-right corner to fan it out, or drag a toast sideways to dismiss it.</p>
            </div>
        </DemoSection>

        <!-- Dialog flows -->
        <DemoSection id="dialog-flows" title="Dialog flows" badge="Updated" description="Promise-based confirm and message dialogs. Async confirm handlers show a spinner on the button that triggered them." :code="dialogCode" language="ts">
            <div class="flex flex-col gap-6">
                <div class="flex flex-wrap gap-3">
                    <Button @click="handleConfirm">
                        <HugeiconsIcon :icon="SaveIcon" />
                        Async confirm
                    </Button>
                    <Button variant="red" @click="handleDestructiveConfirm">
                        <HugeiconsIcon :icon="Delete02Icon" />
                        Destructive confirm
                    </Button>
                </div>
                <div class="flex flex-wrap gap-3">
                    <Button variant="secondary" @click="handleMessage('success')">Success message</Button>
                    <Button variant="secondary" @click="handleMessage('info')">Info message</Button>
                    <Button variant="secondary" @click="handleMessage('warning')">Warning message</Button>
                    <Button variant="secondary" @click="handleMessage('error')">Error message</Button>
                </div>
            </div>
        </DemoSection>

        <!-- Busy and spinner -->
        <DemoSection id="busy" title="Busy overlay & spinner" badge="Updated" description="A global, lazily-mounted busy overlay and a standalone spinner in five sizes.">
            <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex items-end gap-6 text-primary">
                    <Spinner size="xs" />
                    <Spinner size="sm" />
                    <Spinner size="md" />
                    <Spinner size="lg" />
                    <Spinner size="xl" class="text-foreground" />
                </div>
                <Button variant="secondary" @click="handleBusy">
                    <HugeiconsIcon :icon="RefreshIcon" />
                    Show busy overlay
                </Button>
            </div>
        </DemoSection>

        <!-- Alerts -->
        <DemoSection id="alerts" title="Alerts" description="Inline callouts in every tone.">
            <div class="grid gap-3 md:grid-cols-2">
                <Alert>
                    <HugeiconsIcon :icon="InformationCircleIcon" />
                    <AlertTitle>Heads up</AlertTitle>
                    <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
                </Alert>
                <Alert color="green">
                    <HugeiconsIcon :icon="CheckmarkCircle02Icon" />
                    <AlertTitle>Deployment succeeded</AlertTitle>
                    <AlertDescription>Build #1842 finished in 42 seconds.</AlertDescription>
                </Alert>
                <Alert color="yellow">
                    <HugeiconsIcon :icon="Alert02Icon" />
                    <AlertTitle>Approaching limit</AlertTitle>
                    <AlertDescription>You have used 92% of your monthly build minutes.</AlertDescription>
                </Alert>
                <Alert color="red">
                    <HugeiconsIcon :icon="Alert02Icon" />
                    <AlertTitle>Payment failed</AlertTitle>
                    <AlertDescription>Update your card to keep your workspace active.</AlertDescription>
                </Alert>
            </div>
        </DemoSection>

        <!-- Empty and loading states -->
        <DemoSection id="states" title="Empty & loading states" description="Drop-in cards for zero-data and loading moments. The empty icon floats gently.">
            <div class="grid gap-4 md:grid-cols-2">
                <EmptyStateCard title="No results" description="Try a different search term or clear your filters." :icon="Search01Icon">
                    <template #action>
                        <Button variant="secondary" size="sm" class="mt-2">
                            <HugeiconsIcon :icon="PlusSignIcon" />
                            Create project
                        </Button>
                    </template>
                </EmptyStateCard>
                <LoadingStateCard title="Crunching numbers" description="Aggregating the last 30 days of events." />
            </div>
        </DemoSection>
    </div>
</template>