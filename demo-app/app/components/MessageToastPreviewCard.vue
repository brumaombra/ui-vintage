<script setup lang="ts">
import { AlertCircleIcon, CheckmarkCircle02Icon, InformationCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { showMessageToast } from '@/components/message-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Trigger success toast
const handleShowSuccessToast = () => {
    showMessageToast({
        message: 'Changes saved successfully. This success toast closes automatically after a few seconds.',
        type: 'success'
    });
};

// Trigger informational toast
const handleShowInfoToast = () => {
    showMessageToast({
        message: 'A new report is ready to review. This informational toast uses the neutral status styling.',
        type: 'info'
    });
};

// Trigger warning toast
const handleShowWarningToast = () => {
    showMessageToast({
        message: 'Your session will expire soon. This warning toast highlights a time-sensitive state.',
        type: 'warning'
    });
};

// Trigger persistent error toast
const handleShowErrorToast = () => {
    showMessageToast({
        message: 'Sync failed. This error toast stays open until you dismiss it manually.',
        type: 'error',
        duration: 0
    });
};
</script>

<template>
    <Card>
        <!-- Card header -->
        <CardHeader>
            <CardTitle>Message Toast</CardTitle>
            <CardDescription>
                Trigger auto-dismiss and persistent toast states using the shared floating feedback component.
            </CardDescription>
        </CardHeader>

        <!-- Card content -->
        <CardContent class="space-y-4">
            <div class="flex flex-wrap gap-3">
                <!-- Button to trigger success toast -->
                <Button @click="handleShowSuccessToast">
                    <HugeiconsIcon :icon="CheckmarkCircle02Icon" class="size-4" />
                    Show Success Toast
                </Button>

                <!-- Button to trigger informational toast -->
                <Button variant="outline" @click="handleShowInfoToast">
                    <HugeiconsIcon :icon="InformationCircleIcon" class="size-4" />
                    Show Info Toast
                </Button>

                <!-- Button to trigger warning toast -->
                <Button variant="secondary" @click="handleShowWarningToast">
                    <HugeiconsIcon :icon="AlertCircleIcon" class="size-4" />
                    Show Warning Toast
                </Button>

                <!-- Button to trigger persistent error toast -->
                <Button variant="destructive" @click="handleShowErrorToast">
                    <HugeiconsIcon :icon="AlertCircleIcon" class="size-4" />
                    Show Error Toast
                </Button>
            </div>

            <!-- Instructional alert -->
            <Alert>
                <HugeiconsIcon :icon="InformationCircleIcon" />
                <AlertDescription>
                    Standard toast states now include success, info, warning, and error. The error example stays open so you can inspect the dismiss action.
                </AlertDescription>
            </Alert>
        </CardContent>
    </Card>
</template>