<script setup>
import { Cancel01Icon, CheckmarkCircle02Icon, CircleSmallIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card, CardContent } from '@/components/ui/card';

// Props
const props = defineProps({
    items: { type: Array, default: () => [] },
    variant: { type: String, default: 'checkmark', validator: value => ['circle', 'checkmark', 'numbered', 'cross'].includes(value) }
});

// Icon container classes
const getIconContainerClasses = () => {
    return 'flex items-center justify-center w-8 h-8 bg-[var(--bg-card-light)] dark:bg-[var(--bg-card-dark)] border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded mr-4 flex-shrink-0';
};

// Icon color classes
const getIconClasses = () => {
    return 'text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)] text-xs';
};
</script>

<template>
    <div class="not-prose my-6 sm:my-12">
        <Card>
            <CardContent class="gap-0">
                <ul class="text-xs md:text-sm !p-0 !space-y-6">
                    <li v-for="(item, index) in props.items" :key="index" class="flex items-center">
                        <!-- Circle -->
                        <div v-if="props.variant === 'circle'" :class="getIconContainerClasses()">
                            <HugeiconsIcon :icon="CircleSmallIcon" :class="getIconClasses()" />
                        </div>

                        <!-- Checkmark -->
                        <div v-else-if="props.variant === 'checkmark'" :class="getIconContainerClasses()">
                            <HugeiconsIcon :icon="CheckmarkCircle02Icon" :class="getIconClasses()" />
                        </div>

                        <!-- Numbered -->
                        <div v-else-if="props.variant === 'numbered'" :class="getIconContainerClasses()">
                            <span :class="[getIconClasses(), 'font-semibold']">{{ index + 1 }}</span>
                        </div>

                        <!-- Cross -->
                        <div v-else-if="props.variant === 'cross'" :class="getIconContainerClasses()">
                            <HugeiconsIcon :icon="Cancel01Icon" :class="getIconClasses()" />
                        </div>

                        <!-- Content -->
                        <div class="flex-1">
                            <div class="text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] leading-relaxed">
                                {{ item }}
                            </div>
                        </div>
                    </li>
                </ul>
            </CardContent>
        </Card>
    </div>
</template>