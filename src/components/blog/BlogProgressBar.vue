<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { HTMLAttributes } from 'vue';
import { useI18n } from 'vue-i18n';
import { cn } from '../../lib/utils';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
    ariaLabel?: string;
}>();

const { t } = useI18n();
const resolvedAriaLabel = computed(() => props.ariaLabel || t('uiVintage.blog.readingProgress'));
const progress = ref(0);
let animationFrame = 0;

// Update progress based on scroll position
const updateProgress = () => {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    progress.value = documentHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / documentHeight) * 100)) : 100;
};

// Handle scroll event with requestAnimationFrame for performance
const handleScroll = () => {
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(updateProgress);
};

// On component mounted
onMounted(() => {
    updateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateProgress);
});

// On component unmounted
onUnmounted(() => {
    cancelAnimationFrame(animationFrame);
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', updateProgress);
});
</script>

<template>
    <div :class="cn('relative h-[3px] w-full bg-border/40 landing-navbar-progress', props.class)"
        role="progressbar"
        :aria-label="resolvedAriaLabel"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="Math.round(progress)">
        <!-- Fill with a glowing leading edge (the dot stays inside the fill, so it is never clipped and never widens the page) -->
        <div class="relative h-full bg-linear-to-r from-primary/40 via-primary to-primary transition-[width] duration-150 ease-out" :style="{ width: `${progress}%` }">
            <span v-if="progress > 0" aria-hidden="true" class="absolute top-1/2 right-0 size-2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_2px_color-mix(in_oklab,var(--primary)_70%,transparent)]" />
        </div>
    </div>
</template>

<style scoped>
.landing-navbar-progress {
    animation: landing-navbar-progress-fade linear both;
    animation-range: 0 160px;
    animation-timeline: scroll(root);
}

@keyframes landing-navbar-progress-fade {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@supports not (animation-timeline: scroll()) {
    .landing-navbar-progress {
        opacity: 1;
    }
}
</style>