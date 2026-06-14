<script setup lang="ts">
import { computed, ref } from 'vue';
import { BitcoinIcon, CheckmarkCircle02Icon, InformationCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@brumaombra/ui-vintage/card';
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

            <!-- Compact select sample -->
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

            <!-- Current selection display -->
            <div class="rounded border border-border bg-muted px-4 py-3 text-sm leading-6 text-muted-foreground">
                <!-- Icon and label -->
                <div class="flex items-center gap-2 text-foreground">
                    <HugeiconsIcon :icon="InformationCircleIcon" class="size-4" />
                    <span class="font-semibold">Current selection</span>
                </div>

                <!-- Description -->
                <p class="mt-1">
                    This example keeps the trigger compact while the menu items show icon, label, and description.
                </p>
            </div>
        </CardContent>
    </Card>
</template>