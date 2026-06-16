<script setup>
import { NuxtImg } from '#components';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const { t } = useI18n();

// Props
const props = defineProps({
    featuredPosts: { type: Array, default: () => [] }
});

// Carousel state
const currentSlide = ref(0);
const slideCount = computed(() => props.featuredPosts.length || 0);
const intervalId = ref(null);
const direction = ref('forward');

// Start auto-play functionality
const startAutoPlay = () => {
    intervalId.value = setInterval(nextSlide, 5000);
};

// Stop auto-play functionality
const stopAutoPlay = () => {
    if (intervalId.value) clearInterval(intervalId.value);
};

// Handle next slide press
const nextSlide = () => {
    direction.value = 'forward';
    currentSlide.value = (currentSlide.value + 1) % slideCount.value;
};

// Handle previous slide press
const prevSlide = () => {
    direction.value = 'backward';
    currentSlide.value = (currentSlide.value - 1 + slideCount.value) % slideCount.value;
};

// Go to specific slide
const goToSlide = index => {
    // Determine direction
    if (index > currentSlide.value) {
        direction.value = 'forward';
    } else {
        direction.value = 'backward';
    }

    // Set current slide
    currentSlide.value = index;
};

// Start autoplay when component mounts
onMounted(() => {
    startAutoPlay();
});

// Clean up interval when component unmounts
onUnmounted(() => {
    stopAutoPlay();
});
</script>

<template>
    <div v-if="props.featuredPosts.length > 0" class="relative" @mouseenter="stopAutoPlay" @mouseleave="startAutoPlay">
        <!-- Slides -->
        <div class="relative overflow-hidden rounded">
            <TransitionGroup name="slide">
                <div v-for="(post, index) in props.featuredPosts" :id="`carousel-slide-${index}`" :key="post.path || post.title || index" v-show="currentSlide === index" class="w-full" :data-direction="direction">
                    <Card class="!p-0 overflow-hidden cursor-pointer">
                        <CardContent class="gap-0 !p-0">
                            <!-- Slide image -->
                            <NuxtLink :to="post.path">
                                <div class="relative w-full h-56 md:h-80 overflow-hidden">
                                    <NuxtImg :src="post.image" :alt="post.title" width="560" height="315" format="avif" quality="35" :sizes="{ 480: '480px', 1536: '1086px' }" :loading="index === 0 ? 'eager' : 'lazy'" :fetchpriority="index === 0 ? 'high' : 'auto'" :preload="index === 0" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                                </div>
                            </NuxtLink>

                            <!-- Slide content -->
                            <div class="p-6 md:p-8">
                                <!-- Category badge -->
                                <NuxtLink v-if="post.categoryText && post.categoryPath" :to="post.categoryPath" class="inline-block mb-3">
                                    <Badge color="gray" :text="post.categoryText" />
                                </NuxtLink>

                                <!-- Title -->
                                <NuxtLink :to="post.path">
                                    <h3 class="text-base md:text-3xl font-bold text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] mb-3 line-clamp-2 hover:opacity-75 transition-opacity duration-200">
                                        {{ post.title }}
                                    </h3>
                                </NuxtLink>

                                <!-- Description -->
                                <p class="text-xs md:!text-base text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)] mb-6 line-clamp-2 leading-relaxed">
                                    {{ post.description }}
                                </p>

                                <!-- Button + indicators row -->
                                <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                    <!-- Read post button -->
                                    <NuxtLink :to="post.path">
                                        <Button variant="primary" class="w-full sm:w-auto">
                                            <HugeiconsIcon :icon="ArrowRight01Icon" class="size-4" />
                                            {{ t('uiVintage.blog.goToPost') }}
                                        </Button>
                                    </NuxtLink>

                                    <!-- Slide indicators -->
                                    <div v-if="props.featuredPosts.length > 1" class="flex w-full justify-center gap-3 sm:w-auto" role="tablist" :aria-label="t('uiVintage.blog.carouselNavigation')">
                                        <button v-for="(_, idx) in props.featuredPosts"
                                            :key="idx"
                                            @click="goToSlide(idx)"
                                            :class="['h-5 w-5 sm:!h-4 sm:!w-4 shrink-0 rounded-[2px] transition-all duration-300 cursor-pointer bg-[var(--border-light)] dark:bg-[var(--border-dark)]', currentSlide === idx ? '!w-8 sm:!w-7 !bg-[var(--text-primary-light)] dark:!bg-[var(--text-primary-dark)]' : '']"
                                            :aria-label="t('uiVintage.blog.goToSlide', { index: idx + 1 })"
                                            :aria-current="currentSlide === idx"
                                            role="tab"
                                            :aria-controls="`carousel-slide-${idx}`">
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TransitionGroup>
        </div>

        <!-- Previous slide -->
        <button v-if="props.featuredPosts.length > 1"
            @click="prevSlide"
            :aria-label="t('uiVintage.blog.previousSlide')"
            class="absolute left-2 top-[calc(50%-4rem)] -translate-y-1/2 z-10 border border-[var(--border-light)] dark:border-[var(--border-dark)] bg-[var(--bg-card-light)] dark:bg-[var(--bg-card-dark)] px-3 py-3 rounded-none transition-colors duration-200 hover:border-[var(--border-hover-light)] dark:hover:border-[var(--border-hover-dark)] cursor-pointer">
            <HugeiconsIcon :icon="ArrowLeft01Icon" class="size-4 text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]" />
        </button>

        <!-- Next slide -->
        <button v-if="props.featuredPosts.length > 1"
            @click="nextSlide"
            :aria-label="t('uiVintage.blog.nextSlide')"
            class="absolute right-2 top-[calc(50%-4rem)] -translate-y-1/2 z-10 border border-[var(--border-light)] dark:border-[var(--border-dark)] bg-[var(--bg-card-light)] dark:bg-[var(--bg-card-dark)] px-3 py-3 rounded-none transition-colors duration-200 hover:border-[var(--border-hover-light)] dark:hover:border-[var(--border-hover-dark)] cursor-pointer">
            <HugeiconsIcon :icon="ArrowRight01Icon" class="size-4 text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]" />
        </button>
    </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1), filter 0.75s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform, opacity, filter;
}

.slide-enter-from[data-direction="forward"] {
    opacity: 0;
    transform: translateX(12%) scale(0.985);
    filter: blur(4px);
}

.slide-leave-to[data-direction="forward"] {
    opacity: 0;
    transform: translateX(-12%) scale(0.985);
    filter: blur(4px);
}

.slide-enter-from[data-direction="backward"] {
    opacity: 0;
    transform: translateX(-12%) scale(0.985);
    filter: blur(4px);
}

.slide-leave-to[data-direction="backward"] {
    opacity: 0;
    transform: translateX(12%) scale(0.985);
    filter: blur(4px);
}

.slide-leave-active {
    position: absolute;
    width: 100%;
}

.slide-enter-to,
.slide-leave-from {
    opacity: 1;
    transform: translateX(0) scale(1);
    filter: blur(0);
}
</style>