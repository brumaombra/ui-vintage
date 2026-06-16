<script setup lang="ts">
import { computed, ref } from 'vue';
import { BitcoinIcon, CheckmarkCircle02Icon, InformationCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Alert, AlertDescription, AlertTitle } from '@brumaombra/ui-vintage/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@brumaombra/ui-vintage/card';
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from '@brumaombra/ui-vintage/field';
import { Select, SelectContent, SelectItem, SelectItemContent, SelectTrigger, SelectValueContent } from '@brumaombra/ui-vintage/select';

const network = ref(null);
const compactNetwork = ref(null);

// Network options
const networkOptions = [{
    value: 'bitcoin',
    icon: BitcoinIcon,
    label: 'Bitcoin network',
    description: 'Original network, broadest ecosystem support, and the most familiar default for wallet integrations, onboarding flows, and general-purpose previews.'
}, {
    value: 'kaspa',
    icon: CheckmarkCircle02Icon,
    label: 'Kaspa network',
    description: 'Fast block times with a lightweight feel, which makes it a good fit for demos that need a distinct, modern-looking option with a bit more visual personality.'
}, {
    value: 'litecoin',
    icon: InformationCircleIcon,
    label: 'Litecoin network',
    description: 'Established alternative for quick transfers, with a straightforward profile that works well when you want a second recognizable choice in a longer comparison list.'
}];

// Compact network options
const compactNetworkOptions = [{
    value: 'bitcoin',
    icon: BitcoinIcon,
    label: 'Bitcoin'
}, {
    value: 'kaspa',
    icon: CheckmarkCircle02Icon,
    label: 'Kaspa'
}, {
    value: 'litecoin',
    icon: InformationCircleIcon,
    label: 'Litecoin'
}];

// Get the selected network
const selectedNetwork = computed(() => {
    return networkOptions.find(option => option.value === network.value) || null;
});

// Get the selected compact network
const selectedCompactNetwork = computed(() => {
    return compactNetworkOptions.find(option => option.value === compactNetwork.value) || null;
});
</script>

<template>
    <Card>
        <!-- Card header -->
        <CardHeader>
            <CardTitle>Select content</CardTitle>
            <CardDescription>Item content with icons and secondary text for richer dropdown previews.</CardDescription>
        </CardHeader>

        <!-- Card content -->
        <CardContent class="space-y-4">
            <FieldGroup>
                <Field>
                    <FieldLabel>Detailed select</FieldLabel>
                    <FieldContent>
                        <Select v-model="network">
                            <!-- Trigger with icon and label -->
                            <SelectTrigger class="w-full">
                                <SelectValueContent placeholder="Choose a network" :icon="selectedNetwork?.icon ?? null" :label="selectedNetwork?.label ?? null" />
                            </SelectTrigger>

                            <!-- Content with item previews -->
                            <SelectContent>
                                <!-- Bitcoin item -->
                                <SelectItem v-for="option in networkOptions" :key="option.value" :value="option.value">
                                    <SelectItemContent :icon="option.icon" :label="option.label" :description="option.description" />
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <FieldDescription>
                            Uses icon, label, and longer supporting text to show the richer item layout.
                        </FieldDescription>
                    </FieldContent>
                </Field>

                <Field>
                    <FieldLabel>Compact select</FieldLabel>
                    <FieldContent>
                        <Select v-model="compactNetwork">
                            <!-- Trigger with icon and label -->
                            <SelectTrigger class="w-full">
                                <SelectValueContent placeholder="Choose a compact option" :icon="selectedCompactNetwork?.icon ?? null" :label="selectedCompactNetwork?.label ?? null" />
                            </SelectTrigger>

                            <!-- Content with icon and label only -->
                            <SelectContent>
                                <!-- Bitcoin item -->
                                <SelectItem v-for="option in compactNetworkOptions" :key="option.value" :value="option.value">
                                    <SelectItemContent :icon="option.icon" :label="option.label" />
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <FieldDescription>
                            Keeps the trigger and menu rows tighter when only the primary label is needed.
                        </FieldDescription>
                    </FieldContent>
                </Field>
            </FieldGroup>

            <!-- Current selection display -->
            <Alert>
                <HugeiconsIcon :icon="InformationCircleIcon" class="size-4" />
                <AlertTitle>Current selection</AlertTitle>
                <AlertDescription>
                    This example keeps the trigger compact while the menu items show icon, label, and description.
                </AlertDescription>
            </Alert>
        </CardContent>
    </Card>
</template>