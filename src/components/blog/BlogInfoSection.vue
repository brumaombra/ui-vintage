<script setup>
import { NuxtImg } from '#components';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Card, CardContent } from '@/components/ui/card';
import { formatDateLongItalyTimezone } from '@/lib/utils';

// Props
const props = defineProps({
    author: { type: String, required: true },
    authorUrl: { type: String, required: true },
    authorImageUrl: { type: String, required: true },
    datePublished: { type: String, required: true },
    dateModified: { type: String, default: null }
});

const { t, locale } = useI18n();

// Formatted dates
const formattedPublishedDate = computed(() => formatDateLongItalyTimezone(props.datePublished, locale.value));
const formattedModifiedDate = computed(() => formatDateLongItalyTimezone(props.dateModified, locale.value));
</script>

<template>
    <!-- Author and date information -->
    <Card data-aos="fade-up">
        <CardContent>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <!-- Author -->
                <div class="flex items-center mb-4 sm:mb-0">
                    <div class="flex items-center">
                        <!-- Author image -->
                        <NuxtLink :to="props.authorUrl" target="_blank" rel="noopener noreferrer" class="rounded me-3 transition-transform duration-300 ease-out hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100">
                            <NuxtImg :src="props.authorImageUrl" :alt="props.author" height="50" width="50" format="avif" quality="40" :sizes="{ 480: '50px', 1280: '50px' }" loading="lazy" decoding="async" class="object-cover rounded" />
                        </NuxtLink>

                        <!-- Author name -->
                        <div>
                            <p class="text-sm text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]">{{ t('uiVintage.blog.author') }}</p>
                            <p class="font-bold text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)]">
                                <NuxtLink :to="props.authorUrl" target="_blank" rel="noopener noreferrer" class="hover:text-[var(--text-secondary-light)] dark:hover:text-[var(--text-secondary-dark)] transition-colors">
                                    {{ props.author }}
                                </NuxtLink>
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Date information -->
                <div class="flex flex-col sm:items-end text-xs md:text-sm text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]">
                    <!-- Published date -->
                    <div v-if="props.datePublished" class="mb-1">
                        <span class="font-semibold">{{ t('uiVintage.blog.publishedDate') }}:</span>
                        <time :datetime="props.datePublished" class="ml-1">
                            {{ formattedPublishedDate }}
                        </time>
                    </div>

                    <!-- Last updated date -->
                    <div v-if="props.dateModified" class="text-xs">
                        <span class="font-semibold">{{ t('uiVintage.blog.lastUpdatedDate') }}:</span>
                        <time :datetime="props.dateModified" class="ml-1">
                            {{ formattedModifiedDate }}
                        </time>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>