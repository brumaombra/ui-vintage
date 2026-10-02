<script setup lang="ts">
import { NuxtImg } from '#components';
import { useI18n } from 'vue-i18n';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

const { t } = useI18n();

// Props
const props = withDefaults(defineProps<{
    image?: string;
    category?: string;
    title?: string;
    description?: string;
}>(), {
    image: '',
    category: '',
    title: '',
    description: ''
});
</script>

<template>
    <Card interactive class="group/post h-full gap-0! overflow-hidden p-0! sm:gap-0!">
        <!-- Featured image -->
        <div v-if="props.image" class="relative aspect-video w-full overflow-hidden border-b border-border bg-surface">
            <NuxtImg :src="props.image" :alt="props.title" height="225" width="400" format="avif" quality="35" :sizes="{ 480: '480px', 1280: '400px' }" loading="lazy" decoding="async" class="size-full object-cover transition-[scale,filter] duration-700 ease-out-expo group-hover/post:scale-[1.06] group-hover/post:saturate-125" />

            <!-- Shade that deepens on hover -->
            <div aria-hidden="true" class="absolute inset-0 bg-linear-to-t from-black/45 via-black/0 to-black/0 opacity-60 transition-opacity duration-500 group-hover/post:opacity-100" />

            <!-- Category over the image -->
            <Badge v-if="props.category" :text="props.category" class="absolute top-3 left-3 border-white/25 bg-black/35 text-white backdrop-blur-md" />
        </div>

        <!-- Content -->
        <div class="flex grow flex-col gap-3 p-5 sm:p-6">
            <!-- Category (when there is no image to sit on) -->
            <Badge v-if="props.category && !props.image" :text="props.category" />

            <!-- Post title -->
            <h2 class="line-clamp-2 text-base leading-snug font-bold text-foreground transition-colors duration-200 group-hover/post:text-primary">
                {{ props.title }}
            </h2>

            <!-- Post description -->
            <p class="line-clamp-3 grow text-xs leading-relaxed text-muted-foreground md:text-sm">
                {{ props.description }}
            </p>

            <!-- Read more -->
            <span class="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary sm:text-sm">
                {{ t('uiVintage.blog.readMore') }}
                <HugeiconsIcon :icon="ArrowRight01Icon" class="size-4 transition-[translate] duration-300 ease-spring group-hover/post:translate-x-1" />
            </span>
        </div>
    </Card>
</template>