<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { GibbousMoonIcon, Sun01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Button } from '@brumaombra/ui-vintage/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@brumaombra/ui-vintage/card';
import { Select, SelectContent, SelectItem, SelectItemContent, SelectTrigger, SelectValueContent } from '@brumaombra/ui-vintage/select';
import { Switch } from '@brumaombra/ui-vintage/switch';

const isDark = useState('demo-dark-mode', () => false);
const cryptoCoin = useState('demo-crypto-coin', () => 'bitcoin');
const themeLabel = computed(() => isDark.value ? 'Dark' : 'Light');
const cryptoCoinLabel = computed(() => cryptoCoin.value === 'kaspa' ? 'Kaspa' : 'Bitcoin');

// Keep the document theme classes and dataset in sync with the demo controls
const applyDocumentTheme = () => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', isDark.value);
    document.documentElement.dataset.cryptoCoin = cryptoCoin.value;
};

// Watch the theme control states
watch([isDark, cryptoCoin], applyDocumentTheme);

// On component mounted
onMounted(() => {
    applyDocumentTheme();
});
</script>

<template>
    <Card>
        <!-- Card header -->
        <CardHeader>
            <CardTitle>Demo Controls</CardTitle>
            <CardDescription>
                Toggle theme and color token presets while previewing the library.
            </CardDescription>
        </CardHeader>

        <!-- Card content -->
        <CardContent class="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
            <!-- Theme toggle controls -->
            <div class="flex items-center gap-3 rounded border border-border bg-background px-3 py-2">
                <HugeiconsIcon :icon="isDark ? GibbousMoonIcon : Sun01Icon" class="size-4 text-muted-foreground" />
                <span class="text-xs font-semibold text-foreground">{{ themeLabel }}</span>
                <Switch v-model:model-value="isDark" />
            </div>

            <!-- Theme preset selector and quick toggle button -->
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                <!-- Crypto coin preset selector -->
                <Select v-model="cryptoCoin">
                    <SelectTrigger class="min-w-40 bg-background">
                        <SelectValueContent placeholder="Choose a theme" :label="cryptoCoinLabel" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="bitcoin">
                            <SelectItemContent label="Bitcoin" />
                        </SelectItem>
                        <SelectItem value="kaspa">
                            <SelectItemContent label="Kaspa" />
                        </SelectItem>
                    </SelectContent>
                </Select>

                <!-- Quick toggle button -->
                <Button variant="gray" size="sm" @click="isDark = !isDark">
                    Toggle Theme
                </Button>
            </div>
        </CardContent>
    </Card>
</template>