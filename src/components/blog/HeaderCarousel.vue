<script setup lang="ts">
import { NuxtImg } from '#components';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const { t } = useI18n();

// Props
const props = withDefaults(defineProps<{
    featuredPosts?: Array<{
        path: string;
        title: string;
        description?: string;
        image?: string;
        categoryText?: string;
        categoryPath?: string;
    }>;
}>(), {
    featuredPosts: () => []
});

const AUTOPLAY_DURATION_MS = 6000;
const SWIPE_THRESHOLD_PX = 50;

// Carousel state
const currentSlide = ref(0);
const isPaused = ref(false);
const autoplayEnabled = ref(false);
const slideCount = computed(() => props.featuredPosts.length || 0);
let swipeStartX: number | null = null;

// Handle next slide press
const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % slideCount.value;
};

// Handle previous slide press
const prevSlide = () => {
    currentSlide.value = (currentSlide.value - 1 + slideCount.value) % slideCount.value;
};

// Go to specific slide
const goToSlide = (index: number) => {
    currentSlide.value = index;
};

// Pause autoplay while the user hovers, focuses, or leaves the tab
const pause = () => {
    isPaused.value = true;
};
const resume = () => {
    isPaused.value = false;
};
const handleVisibilityChange = () => {
    isPaused.value = document.visibilityState !== 'visible';
};

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') nextSlide();
    if (event.key === 'ArrowLeft') prevSlide();
};

// Swipe navigation on touch devices
const handlePointerDown = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') swipeStartX = event.clientX;
};
const handlePointerUp = (event: PointerEvent) => {
    if (swipeStartX === null) return;
    const deltaX = event.clientX - swipeStartX;
    swipeStartX = null;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
    if (deltaX < 0) nextSlide();
    else prevSlide();
};

// Autoplay is driven by the progress animation of the active indicator, so the bar and the slide change always stay in sync
const handleProgressEnd = () => {
    if (autoplayEnabled.value) nextSlide();
};

// Start autoplay when component mounts (never with reduced motion)
onMounted(() => {
    autoplayEnabled.value = slideCount.value > 1 && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document.addEventListener('visibilitychange', handleVisibilityChange);
});

// Clean up listeners when component unmounts
onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<template>
    <div v-if="props.featuredPosts.length > 0" role="region" aria-roledescription="carousel" :aria-label="t('uiVintage.blog.carouselNavigation')" class="group/carousel relative isolate overflow-hidden rounded border border-border bg-card shadow-elevated-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45" tabindex="0" @mouseenter="pause" @mouseleave="resume" @focusin="pause" @focusout="resume" @keydown="handleKeydown" @pointerdown="handlePointerDown" @pointerup="handlePointerUp">
        <!-- Slides (stacked; the active one crossfades in) -->
        <div class="relative h-[28rem] w-full md:h-[32rem]">
            <div v-for="(post, index) in props.featuredPosts" :id="`carousel-slide-${index}`" :key="post.path || post.title || index" role="group" aria-roledescription="slide" :aria-label="`${index + 1} / ${slideCount}`" :aria-hidden="currentSlide !== index" :inert="currentSlide !== index || undefined" :class="cn('absolute inset-0 transition-[opacity,scale] duration-700 ease-out-expo', currentSlide === index ? 'z-10 scale-100 opacity-100' : 'z-0 scale-[1.02] opacity-0')">
                <!-- Slide image with a slow zoom -->
                <NuxtLink :to="post.path" tabindex="-1" aria-hidden="true" class="absolute inset-0 overflow-hidden">
                    <NuxtImg v-if="post.image" :src="post.image" :alt="post.title" width="1200" height="640" format="avif" quality="45" :sizes="{ 480: '480px', 1536: '1152px' }" :loading="index === 0 ? 'eager' : 'lazy'" :fetchpriority="index === 0 ? 'high' : 'auto'" :preload="index === 0" :class="cn('size-full object-cover', currentSlide === index && 'animate-uv-ken-burns')" />
                    <div v-else class="size-full bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklab,var(--primary)_45%,transparent),transparent_60%)] bg-surface" />
                </NuxtLink>

                <!-- Legibility shade -->
                <div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-black/5" />
                <div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-linear-to-r from-black/50 via-transparent to-transparent" />

                <!-- Slide content (replays its entrance every time the slide becomes active) -->
                <div class="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 pb-20 text-white md:max-w-3xl md:p-10 md:pb-24">
                    <!-- Category badge -->
                    <NuxtLink v-if="post.categoryText && post.categoryPath" :to="post.categoryPath" :class="cn('w-fit', currentSlide === index && 'animate-uv-fade-up')">
                        <Badge :text="post.categoryText" pulse class="border-white/25 bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25" />
                    </NuxtLink>

                    <!-- Title -->
                    <NuxtLink :to="post.path" :class="cn('outline-none', currentSlide === index && 'animate-uv-fade-up [animation-delay:90ms]')">
                        <h3 class="line-clamp-3 text-2xl leading-tight font-bold tracking-tight text-balance drop-shadow-sm md:text-5xl">
                            {{ post.title }}
                        </h3>
                    </NuxtLink>

                    <!-- Description -->
                    <p v-if="post.description" :class="cn('line-clamp-2 max-w-2xl text-xs leading-relaxed text-white/80 md:text-base', currentSlide === index && 'animate-uv-fade-up [animation-delay:180ms]')">
                        {{ post.description }}
                    </p>

                    <!-- Read post button -->
                    <div :class="cn(currentSlide === index && 'animate-uv-fade-up [animation-delay:260ms]')">
                        <Button as-child size="lg" class="group/cta">
                            <NuxtLink :to="post.path">
                                {{ t('uiVintage.blog.goToPost') }}
                                <HugeiconsIcon :icon="ArrowRight01Icon" class="size-4 transition-[translate] duration-300 ease-spring group-hover/cta:translate-x-1" />
                            </NuxtLink>
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Controls bar -->
        <div v-if="slideCount > 1" class="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-4 p-6 md:px-10 md:pb-8">
            <!-- Slide indicators (the active one fills up until the next slide) -->
            <div class="flex items-center gap-2" role="tablist" :aria-label="t('uiVintage.blog.carouselNavigation')">
                <button v-for="(_, index) in props.featuredPosts" :key="index" type="button" role="tab" :aria-selected="currentSlide === index" :aria-controls="`carousel-slide-${index}`" :aria-label="t('uiVintage.blog.goToSlide', { index: index + 1 })" :class="cn('relative h-1.5 cursor-pointer overflow-hidden rounded-full bg-white/30 outline-none transition-[width,background-color] duration-500 ease-spring hover:bg-white/50 focus-visible:ring-2 focus-visible:ring-white', currentSlide === index ? 'w-12' : 'w-4')" @click="goToSlide(index)">
                    <span v-if="currentSlide === index" :key="`progress-${currentSlide}`" class="absolute inset-0 origin-left rounded-full bg-primary" :style="autoplayEnabled ? { animation: `uv-grow-x ${AUTOPLAY_DURATION_MS}ms linear both`, animationPlayState: isPaused ? 'paused' : 'running' } : undefined" @animationend="handleProgressEnd" />
                </button>
            </div>

            <!-- Previous and next buttons -->
            <div class="flex items-center gap-2">
                <button type="button" :aria-label="t('uiVintage.blog.previousSlide')" class="flex size-10 cursor-pointer items-center justify-center rounded border border-white/25 bg-black/30 text-white backdrop-blur-md outline-none [transition:background-color_150ms,scale_300ms_var(--ease-spring)] hover:bg-white/20 active:scale-90 focus-visible:ring-2 focus-visible:ring-white" @click="prevSlide">
                    <HugeiconsIcon :icon="ArrowLeft01Icon" class="size-4" />
                </button>
                <button type="button" :aria-label="t('uiVintage.blog.nextSlide')" class="flex size-10 cursor-pointer items-center justify-center rounded border border-white/25 bg-black/30 text-white backdrop-blur-md outline-none [transition:background-color_150ms,scale_300ms_var(--ease-spring)] hover:bg-white/20 active:scale-90 focus-visible:ring-2 focus-visible:ring-white" @click="nextSlide">
                    <HugeiconsIcon :icon="ArrowRight01Icon" class="size-4" />
                </button>
            </div>
        </div>
    </div>
</template>