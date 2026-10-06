<script setup lang="ts">
import { NuxtImg } from '#components';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { HTMLAttributes } from 'vue';
import BlogProgressBar from '../../blog/BlogProgressBar.vue';
import { cn } from '../../../lib/utils';

// Props
const props = withDefaults(defineProps<{
    appName?: string;
    appLogo?: string;
    appLinkTo?: string;
    logoClass?: HTMLAttributes['class'];
    class?: HTMLAttributes['class'];
    containerClass?: HTMLAttributes['class'];
    leftClass?: HTMLAttributes['class'];
    rightClass?: HTMLAttributes['class'];
    showProgress?: boolean;
}>(), {
    appName: '',
    appLogo: '',
    appLinkTo: '/',
    showProgress: false
});

const SCROLL_THRESHOLD_PX = 12;
const isScrolled = ref(false);

// Float the navbar once the page leaves the top
const handleScroll = () => {
    isScrolled.value = window.scrollY > SCROLL_THRESHOLD_PX;
};

// On component mounted
onMounted(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
});

// On before component unmount
onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <!-- Transparent at the top of the page, a floating card once scrolled -->
    <header :data-scrolled="isScrolled ? '' : undefined" :class="cn('sticky top-0 z-30 w-full text-card-foreground transition-[padding] duration-500 ease-out-expo', isScrolled ? 'px-2 pt-2 sm:px-4 sm:pt-3' : 'px-0 pt-0', props.class)">
        <div :class="cn('relative mx-auto border transition-[max-width,border-radius,background-color,border-color,box-shadow] duration-500 ease-out-expo', isScrolled ? 'max-w-5xl rounded border-border bg-card shadow-elevated-md' : 'max-w-6xl rounded-none border-transparent bg-transparent shadow-none')">
            <nav :class="cn('flex items-center justify-between px-3 transition-[height] duration-500 ease-out-expo sm:px-6 lg:px-8', isScrolled ? 'h-16 sm:px-5 lg:px-5' : 'h-20', props.containerClass)">
                <!-- Left-aligned content -->
                <div :class="cn('flex items-center', props.leftClass)">
                    <slot name="left">
                        <a :href="props.appLinkTo" class="inline-flex items-center gap-2 transition-opacity duration-150 hover:opacity-80">
                            <!-- App logo -->
                            <NuxtImg v-if="props.appLogo" :src="props.appLogo" :alt="`${props.appName} logo`" width="44" height="44" :sizes="{ 320: '44px', 640: '36px' }" loading="eager" fetchpriority="high" :class="cn('size-11 sm:size-9 shrink-0 object-contain', props.logoClass)" />

                            <!-- App name -->
                            <span v-if="props.appName" class="hidden sm:inline! text-xl font-semibold tracking-tight text-foreground">
                                {{ props.appName }}
                            </span>
                        </a>
                    </slot>
                </div>

                <!-- Right-aligned content -->
                <div :class="cn('flex items-center justify-end gap-2 sm:gap-3', props.rightClass)">
                    <slot name="right" />
                </div>
            </nav>

            <!-- Reading progress along the bottom edge of the floating bar (edge to edge, clipped to its rounded corners) -->
            <div v-if="props.showProgress" :class="cn('absolute inset-x-0 bottom-0 overflow-hidden rounded-b-[inherit] transition-opacity duration-300', isScrolled ? 'opacity-100' : 'opacity-0')">
                <BlogProgressBar />
            </div>
        </div>
    </header>
</template>