<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { cn } from '../../../lib/utils';

// Props
const props = withDefaults(defineProps<{
    value: number;
    duration?: number;
    locale?: string;
    formatOptions?: Intl.NumberFormatOptions;
    prefix?: string;
    suffix?: string;
    animateOnMount?: boolean;
    class?: HTMLAttributes['class'];
}>(), {
    duration: 900,
    locale: undefined,
    formatOptions: undefined,
    prefix: '',
    suffix: '',
    animateOnMount: true
});

const displayValue = ref(props.animateOnMount ? 0 : props.value);
const direction = ref<'up' | 'down' | null>(null);
let frame: number | null = null;

// Format the displayed value
const formatter = computed(() => {
    // Default to the precision of the target so intermediate frames never show stray decimals
    const decimals = (String(props.value).split('.')[1] ?? '').length;
    return new Intl.NumberFormat(props.locale, props.formatOptions ?? { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
});
const formattedValue = computed(() => `${props.prefix}${formatter.value.format(displayValue.value)}${props.suffix}`);

// Decelerating curve so the count settles gently on the final value
const easeOutExpo = (progress: number) => progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

// Tween from the current displayed value to the target value
const animateTo = (target: number) => {
    if (frame !== null) cancelAnimationFrame(frame);

    // Jump straight to the value when motion is reduced or unavailable
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (typeof requestAnimationFrame === 'undefined' || prefersReducedMotion || props.duration <= 0) {
        displayValue.value = target;
        return;
    }

    const from = displayValue.value;
    const start = performance.now();
    direction.value = target >= from ? 'up' : 'down';

    // Advance one frame of the tween
    const step = (now: number) => {
        const progress = Math.min(1, (now - start) / props.duration);
        displayValue.value = from + (target - from) * easeOutExpo(progress);
        if (progress < 1) {
            frame = requestAnimationFrame(step);
        } else {
            displayValue.value = target;
            direction.value = null;
            frame = null;
        }
    };
    frame = requestAnimationFrame(step);
};

// Re-animate whenever the value changes
watch(() => props.value, value => animateTo(value));

// Count up on mount
onMounted(() => {
    if (props.animateOnMount) animateTo(props.value);
});

// Stop any pending frame
onBeforeUnmount(() => {
    if (frame !== null) cancelAnimationFrame(frame);
});
</script>

<template>
    <span data-slot="animated-number" :data-direction="direction ?? undefined" :aria-label="`${props.prefix}${formatter.format(props.value)}${props.suffix}`" :class="cn('inline-block tabular-nums', props.class)">
        <span aria-hidden="true">{{ formattedValue }}</span>
    </span>
</template>