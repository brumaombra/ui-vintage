<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import type { HTMLAttributes } from 'vue';
import { cn } from '../../lib/utils';

// Props
const props = withDefaults(defineProps<{
    class?: HTMLAttributes['class'];
    ariaLabel?: string;
}>(), {
    ariaLabel: 'Reading progress'
});

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
    <div :class="cn('relative h-1 w-full border-t border-(--border-light) bg-(--bg-selected-light) dark:border-(--border-dark) dark:bg-(--bg-selected-dark) landing-navbar-progress', props.class)"
        role="progressbar"
        :aria-label="props.ariaLabel"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="Math.round(progress)">
        <div class="h-full origin-left bg-primary transition-[width] duration-150 ease-out" :style="{ width: `${progress}%` }" />
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