<script setup lang="ts">
import { NuxtImg } from '#components';
import { useI18n } from 'vue-i18n';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
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
    <Card class="group/post h-full gap-0! overflow-hidden p-0! transition-[translate,box-shadow] duration-300 ease-out-expo hover:-translate-y-0.5 hover:shadow-elevated-md">
        <!-- Featured image -->
        <div v-if="props.image" class="aspect-video w-full overflow-hidden border-b border-border bg-surface">
            <NuxtImg :src="props.image" :alt="props.title" height="225" width="400" format="avif" quality="35" :sizes="{ 480: '480px', 1280: '400px' }" loading="lazy" decoding="async" class="size-full object-cover transition-[scale] duration-700 ease-out-expo group-hover/post:scale-[1.03]" />
        </div>

        <!-- Content -->
        <div class="flex grow flex-col gap-2 px-5 py-4">
            <!-- Category -->
            <span v-if="props.category" class="text-[11px] font-semibold uppercase tracking-wider text-primary">{{ props.category }}</span>

            <!-- Post title -->
            <h2 class="line-clamp-2 text-sm leading-snug font-semibold text-foreground transition-colors duration-200 group-hover/post:text-primary md:text-base">
                {{ props.title }}
            </h2>

            <!-- Post description -->
            <p class="line-clamp-3 grow text-xs leading-relaxed text-muted-foreground md:text-sm">
                {{ props.description }}
            </p>
        </div>

        <!-- Read more -->
        <div class="flex items-center justify-between border-t border-border bg-surface px-5 py-2.5 text-xs text-muted-foreground transition-colors duration-200 group-hover/post:bg-primary/10 group-hover/post:text-primary">
            <span class="font-medium">{{ t('uiVintage.blog.readMore') }}</span>
            <HugeiconsIcon :icon="ArrowRight01Icon" class="size-4 transition-[translate] duration-300 ease-spring group-hover/post:translate-x-1" />
        </div>
    </Card>
</template>
