<script setup>
import { NuxtImg } from '#components';
import { useI18n } from 'vue-i18n';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

const { t } = useI18n();

// Props
const props = defineProps({
    image: { type: String, default: '' },
    category: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' }
});
</script>

<template>
    <Card class="!p-0 overflow-hidden group cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
        <CardContent class="h-full gap-0 !p-0">
            <!-- Featured image -->
            <div v-if="props.image" class="relative w-full h-48 overflow-hidden">
                <NuxtImg :src="props.image" :alt="props.title" height="225" width="400" format="avif" quality="35" :sizes="{ 480: '480px', 1280: '400px' }" loading="lazy" decoding="async" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>

            <!-- Content -->
            <div class="p-6 flex flex-col flex-grow">
                <!-- Category Badge -->
                <div v-if="props.category" class="mb-3">
                    <Badge color="gray" :text="props.category" />
                </div>

                <!-- Post Title -->
                <h2 class="text-base font-bold text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] mb-2 line-clamp-2">
                    {{ props.title }}
                </h2>

                <!-- Post Description -->
                <p class="text-xs md:text-sm text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)] leading-relaxed mb-4 line-clamp-3 flex-grow">
                    {{ props.description }}
                </p>

                <!-- Read More Button -->
                <div class="mt-auto">
                    <Button variant="primary" class="w-full sm:w-auto">
                        <HugeiconsIcon :icon="ArrowRight01Icon" class="size-4" />
                        {{ t('uiVintage.blog.readMore') }}
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
</template>