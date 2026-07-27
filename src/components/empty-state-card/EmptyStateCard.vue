<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { PackageIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card, CardContent } from '../ui/card';
import type { HugeiconsIconDefinition } from '../../lib/common-types';

// Props
const props = withDefaults(defineProps<{
    icon?: HugeiconsIconDefinition;
    title?: string;
    description?: string;
    titleKey?: string;
    descriptionKey?: string;
}>(), {
    icon: () => PackageIcon,
    title: '',
    description: '',
    titleKey: '',
    descriptionKey: ''
});

const { t } = useI18n();
const hasCustomCopy = computed(() => Boolean(props.title || props.description || props.titleKey || props.descriptionKey));

// Title
const resolvedTitle = computed(() => props.title
    || (props.titleKey ? t(props.titleKey) : '')
    || (!hasCustomCopy.value ? t('uiVintage.common.empty.title') : '')
    || (!hasCustomCopy.value ? 'Nothing here yet' : ''));

// Description
const resolvedDescription = computed(() => props.description
    || (props.descriptionKey ? t(props.descriptionKey) : '')
    || (!hasCustomCopy.value ? t('uiVintage.common.empty.description') : '')
    || (!hasCustomCopy.value ? 'There is no content to show right now.' : ''));
</script>

<template>
    <Card class="flex flex-col items-center justify-center px-4 py-8 text-center md:py-12">
        <CardContent class="flex flex-col items-center justify-center p-0! text-center">
            <!-- Icon -->
            <div class="flex items-center justify-center text-4xl text-(--text-secondary-light) opacity-40 dark:text-(--text-secondary-dark)">
                <HugeiconsIcon :icon="props.icon" class="size-10" />
            </div>

            <!-- Title -->
            <h3 v-if="resolvedTitle" class="text-sm font-bold text-(--text-primary-light) dark:text-(--text-primary-dark) md:text-lg">
                {{ resolvedTitle }}
            </h3>

            <!-- Description -->
            <p v-if="resolvedDescription" class="max-w-md text-xs text-(--text-secondary-light) dark:text-(--text-secondary-dark) md:text-sm">
                {{ resolvedDescription }}
            </p>

            <!-- Action slot -->
            <div v-if="$slots.action">
                <slot name="action" />
            </div>
        </CardContent>
    </Card>
</template>