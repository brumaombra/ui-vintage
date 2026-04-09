<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@brumaombra/ui-vintage/card';

// Props
const props = defineProps<{
    name: string;
    network: string;
    alertsEnabled: boolean;
}>();
</script>

<template>
    <Card>
        <!-- Card header -->
        <CardHeader>
            <CardTitle>Current State</CardTitle>
            <CardDescription>
                Quick values from the live demo controls.
            </CardDescription>
        </CardHeader>

        <!-- Card content -->
        <CardContent class="space-y-3 text-sm">
            <!-- Display current name -->
            <div class="flex items-center justify-between gap-3 rounded border border-border bg-background px-3 py-2">
                <span class="text-muted-foreground">Name</span>
                <span class="truncate font-medium">{{ props.name }}</span>
            </div>

            <!-- Display current network -->
            <div class="flex items-center justify-between gap-3 rounded border border-border bg-background px-3 py-2">
                <span class="text-muted-foreground">Network</span>
                <span class="font-medium capitalize">{{ props.network }}</span>
            </div>

            <!-- Display current alerts enabled state -->
            <div class="flex items-center justify-between gap-3 rounded border border-border bg-background px-3 py-2">
                <span class="text-muted-foreground">Alerts</span>
                <span class="font-medium">{{ props.alertsEnabled ? 'Enabled' : 'Disabled' }}</span>
            </div>
        </CardContent>
    </Card>
</template>