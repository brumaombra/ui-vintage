<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Loading03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card, CardContent } from '../ui/card';
import type { HeadingLevel, HugeiconsIconDefinition } from '../../lib/common-types';

// Props
const props = withDefaults(defineProps<{
    icon?: HugeiconsIconDefinition;
    title?: string;
    description?: string;
    level?: HeadingLevel;
}>(), {
    icon: () => Loading03Icon,
    title: '',
    description: '',
    level: 3
});

const { t } = useI18n();
const resolvedTitle = computed(() => props.title || t('uiVintage.common.loading.title'));
const resolvedDescription = computed(() => props.description || t('uiVintage.common.loading.description'));
</script>

<template>
    <Card class="flex flex-col items-center justify-center px-4 py-8 text-center md:py-12">
        <CardContent class="flex flex-col items-center justify-center p-0! text-center">
            <!-- Loading spinner icon -->
            <span aria-hidden="true" class="flex size-12 items-center justify-center rounded border border-border bg-surface text-primary">
                <HugeiconsIcon :icon="props.icon" class="size-5 animate-spin" />
            </span>

            <!-- Title -->
            <component :is="`h${props.level}`"
                v-if="resolvedTitle"
                class="text-sm font-semibold text-foreground md:text-base">
                {{ resolvedTitle }}
            </component>

            <!-- Description -->
            <p v-if="resolvedDescription" class="max-w-md text-xs text-muted-foreground md:text-sm">
                {{ resolvedDescription }}
            </p>

            <!-- Slot for additional content -->
            <slot />
        </CardContent>
    </Card>
</template>