<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { MoonStar, SunMedium } from 'lucide-vue-next';
import { Button } from '@brumaombra/ui-vintage/button';
import { ErrorPage } from '@brumaombra/ui-vintage/error-page';

// Props
const props = defineProps<{
    error?: {
        statusCode?: number;
        statusMessage?: string;
        message?: string;
    };
}>();

const isDark = useState('demo-dark-mode', () => false);
const cryptoCoin = useState('demo-crypto-coin', () => 'bitcoin');
const themeLabel = computed(() => isDark.value ? 'Dark' : 'Light');

// Keep the document theme classes and dataset in sync with the demo controls
const applyDocumentTheme = () => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', isDark.value);
    document.documentElement.dataset.cryptoCoin = cryptoCoin.value;
};

// Resolve the error message shown in the card
const errorMessage = computed(() => {
    return props.error?.statusMessage || props.error?.message || undefined;
});

// Clear the active error and return to the demo home page
const handleBackHome = async () => {
    await clearError({ redirect: '/' });
};

// Watch the theme control states
watch([isDark, cryptoCoin], applyDocumentTheme);

// On component mounted
onMounted(() => {
    applyDocumentTheme();
});
</script>

<template>
    <ErrorPage :status-code="props.error?.statusCode" :message="errorMessage" action-label="Back to demo" @action="handleBackHome">
        <template #toolbar>
            <div class="flex items-center gap-3">
                <!-- Current theme display -->
                <span class="rounded border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground uppercase tracking-[0.16em]">
                    {{ themeLabel }}
                </span>

                <!-- Change theme -->
                <Button variant="outline" size="sm" @click="isDark = !isDark">
                    <component :is="isDark ? MoonStar : SunMedium" class="size-4" />
                    Toggle Theme
                </Button>
            </div>
        </template>

        <template #brand>
            <div class="flex items-center gap-3">
                <!-- Current demo label -->
                <span class="rounded border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground uppercase tracking-[0.16em]">
                    Demo
                </span>

                <!-- App name -->
                <div class="text-sm font-medium text-foreground">
                    UI Vintage
                </div>
            </div>
        </template>
    </ErrorPage>
</template>