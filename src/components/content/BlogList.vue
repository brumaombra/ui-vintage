<script setup lang="ts">
import { Cancel01Icon, CheckmarkCircle02Icon, CircleSmallIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card, CardContent } from '../ui/card';

// Props
const props = withDefaults(defineProps<{
    items?: string[];
    variant?: 'circle' | 'checkmark' | 'numbered' | 'cross';
}>(), {
    items: () => [],
    variant: 'checkmark'
});

// Icon container classes
const getIconContainerClasses = () => {
    const toneClasses = {
        checkmark: 'border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/30',
        cross: 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30',
        numbered: 'border-primary/30 bg-primary/10',
        circle: 'border-primary/30 bg-primary/10'
    };
    return ['flex items-center justify-center size-8 border rounded mr-4 shrink-0', toneClasses[props.variant]];
};

// Icon color classes
const getIconClasses = () => {
    const toneClasses = {
        checkmark: 'text-green-600 dark:text-green-400',
        cross: 'text-red-600 dark:text-red-400',
        numbered: 'text-primary',
        circle: 'text-primary'
    };
    return ['text-xs size-4', toneClasses[props.variant]];
};
</script>

<template>
    <div class="not-prose my-6 sm:my-8">
        <Card data-aos="blur-up">
            <CardContent class="gap-0">
                <ul class="text-xs md:text-sm p-0! space-y-6!">
                    <li v-for="(item, index) in props.items" :key="index" data-aos="blur-up" :data-aos-delay="100 + index * 80" class="flex items-center">
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
                            <div class="text-foreground leading-relaxed">
                                {{ item }}
                            </div>
                        </div>
                    </li>
                </ul>
            </CardContent>
        </Card>
    </div>
</template>