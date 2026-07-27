<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Loading03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card, CardContent } from '../ui/card';

type HugeiconsIconDefinition = readonly (readonly [string, { readonly [key: string]: string | number }])[];

// Props
const props = withDefaults(defineProps<{
    icon?: HugeiconsIconDefinition;
    title?: string;
    description?: string;
}>(), {
    icon: () => Loading03Icon,
    title: '',
    description: ''
});

const { t } = useI18n();
const resolvedTitle = computed(() => props.title || t('uiVintage.common.loading.title') || 'Loading...');
const resolvedDescription = computed(() => props.description || t('uiVintage.common.loading.description') || 'Please wait a moment while we load the content.');
</script>

<template>
    <Card class="flex flex-col items-center justify-center px-4 py-8 text-center md:py-12">
        <CardContent class="flex flex-col items-center justify-center p-0! text-center">
            <!-- Loading spinner icon -->
            <div class="flex items-center justify-center text-4xl text-(--text-secondary-light) opacity-60 dark:text-(--text-secondary-dark)">
                <HugeiconsIcon :icon="props.icon" class="size-10 animate-spin" />
            </div>

            <!-- Title -->
            <h3 v-if="resolvedTitle" class="text-sm font-bold text-(--text-primary-light) dark:text-(--text-primary-dark) md:text-lg">
                {{ resolvedTitle }}
            </h3>

            <!-- Description -->
            <p v-if="resolvedDescription" class="max-w-md text-xs text-(--text-secondary-light) dark:text-(--text-secondary-dark) md:text-sm">
                {{ resolvedDescription }}
            </p>

            <!-- Slot for additional content -->
            <slot />
        </CardContent>
    </Card>
</template>