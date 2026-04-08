<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { MoonStar, SunMedium } from 'lucide-vue-next';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectItemText, SelectTrigger, SelectValue, Switch } from '@brumaombra/ui-vintage';

const isDark = useState('demo-dark-mode', () => false);
const cryptoCoin = useState('demo-crypto-coin', () => 'bitcoin');

const themeLabel = computed(() => isDark.value ? 'Dark' : 'Light');

const applyDocumentTheme = () => {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.classList.toggle('dark', isDark.value);
    document.documentElement.dataset.cryptoCoin = cryptoCoin.value;
};

watch([isDark, cryptoCoin], applyDocumentTheme);

onMounted(() => {
    applyDocumentTheme();
});
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>Demo Controls</CardTitle>
            <CardDescription>
                Toggle theme and color token presets while previewing the library.
            </CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
            <div class="flex items-center gap-3 rounded border border-border bg-background px-3 py-2">
                <component :is="isDark ? MoonStar : SunMedium" class="size-4 text-muted-foreground" />
                <span class="text-xs font-medium text-foreground">{{ themeLabel }}</span>
                <Switch v-model:model-value="isDark" />
            </div>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Select v-model="cryptoCoin">
                    <SelectTrigger class="min-w-40 bg-background">
                        <SelectValue placeholder="Choose a theme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="bitcoin">
                            <SelectItemText>Bitcoin</SelectItemText>
                        </SelectItem>
                        <SelectItem value="kaspa">
                            <SelectItemText>Kaspa</SelectItemText>
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Button variant="outline" size="sm" @click="isDark = !isDark">
                    Toggle Theme
                </Button>
            </div>
        </CardContent>
    </Card>
</template>