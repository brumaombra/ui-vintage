<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { PackageIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card, CardContent } from '@/components/ui/card';

// Props
const props = defineProps({
    icon: { type: [Object, Array], default: () => PackageIcon },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    titleKey: { type: String, default: '' },
    descriptionKey: { type: String, default: '' }
});

const { t } = useI18n();

const hasCustomCopy = computed(() => Boolean(props.title || props.description || props.titleKey || props.descriptionKey));
const resolvedTitle = computed(() => props.title
    || (props.titleKey ? t(props.titleKey) : '')
    || (!hasCustomCopy.value ? t('uiVintage.common.empty.title') : '')
    || (!hasCustomCopy.value ? 'Nothing here yet' : ''));
const resolvedDescription = computed(() => props.description
    || (props.descriptionKey ? t(props.descriptionKey) : '')
    || (!hasCustomCopy.value ? t('uiVintage.common.empty.description') : '')
    || (!hasCustomCopy.value ? 'There is no content to show right now.' : ''));
</script>

<template>
    <Card class="flex flex-col items-center justify-center px-4 py-8 text-center md:py-12">
        <CardContent class="flex flex-col items-center justify-center !p-0 text-center">
            <!-- Icon -->
            <div class="flex items-center justify-center text-4xl text-[var(--text-secondary-light)] opacity-40 dark:text-[var(--text-secondary-dark)]">
                <HugeiconsIcon :icon="props.icon" class="size-10" />
            </div>

            <!-- Title -->
            <h3 v-if="resolvedTitle" class="text-sm font-bold text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] md:text-lg">
                {{ resolvedTitle }}
            </h3>

            <!-- Description -->
            <p v-if="resolvedDescription" class="max-w-md text-xs text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)] md:text-sm">
                {{ resolvedDescription }}
            </p>

            <!-- Action slot -->
            <div v-if="$slots.action">
                <slot name="action" />
            </div>
        </CardContent>
    </Card>
</template>