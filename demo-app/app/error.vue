<script setup lang="ts">
import { computed } from 'vue';
import { ErrorPage } from '@brumaombra/ui-vintage/error-page';
import { ThemeSelector } from '@brumaombra/ui-vintage/theme-selector';

// Props
const props = defineProps<{
    error?: {
        statusCode?: number;
        statusMessage?: string;
        message?: string;
    };
}>();

// Resolve the error message shown in the card
const errorMessage = computed(() => {
    return props.error?.statusMessage || props.error?.message || undefined;
});

// Clear the active error and return to the demo home page
const handleBackHome = async () => {
    await clearError({ redirect: '/' });
};
</script>

<template>
    <ErrorPage :status-code="props.error?.statusCode" :message="errorMessage" action-label="Back to demo" @action="handleBackHome">
        <!-- Theme selector -->
        <template #toolbar>
            <ThemeSelector />
        </template>

        <!-- Brand -->
        <template #brand>
            <div class="flex items-center gap-3">
                <span class="flex size-9 items-center justify-center rounded bg-primary text-sm font-semibold text-primary-foreground">
                    UV
                </span>
                <div class="text-sm font-semibold text-foreground">
                    UI Vintage
                </div>
            </div>
        </template>
    </ErrorPage>
</template>