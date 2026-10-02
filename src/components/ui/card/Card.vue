<script setup lang="ts">
import { computed, ref } from 'vue';
import type { HTMLAttributes } from 'vue';
import {
    getSurfaceToneClasses,
    type ToneColor,
} from '../../../lib/color-tokens';
import { cn } from '../../../lib/utils';

type CardColor = 'default' | ToneColor;

// Props
const props = withDefaults(defineProps<{
    color?: CardColor;
    interactive?: boolean;
    class?: HTMLAttributes['class'];
}>(), {
    interactive: false
});

const cardRef = ref<HTMLElement | null>(null);

// Get the appropriate classes
const colorClasses = computed(() => {
    // If color is not specified or is "default", use the default card styles
    if (!props.color || props.color === 'default') {
        return 'border border-border bg-card text-card-foreground shadow-elevated-sm';
    }

    // For other colors, use the corresponding surface tone classes
    return getSurfaceToneClasses(props.color);
});

// Track the pointer so interactive cards can render a spotlight under the cursor
const handlePointerMove = (event: PointerEvent) => {
    if (!props.interactive || !cardRef.value) return;
    const rect = cardRef.value.getBoundingClientRect();
    cardRef.value.style.setProperty('--uv-spot-x', `${event.clientX - rect.left}px`);
    cardRef.value.style.setProperty('--uv-spot-y', `${event.clientY - rect.top}px`);
};
</script>

<template>
    <div ref="cardRef" data-slot="card" :data-interactive="props.interactive ? '' : undefined" :class="cn(
        'relative flex flex-col gap-4 sm:gap-6! rounded py-6 transition-[border-color,box-shadow,background-color,translate] duration-300 ease-out-expo',
        colorClasses,
        props.interactive && 'cursor-pointer hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-elevated-lg active:translate-y-0 active:duration-100 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:opacity-0 before:transition-opacity before:duration-300 before:bg-[radial-gradient(360px_circle_at_var(--uv-spot-x,50%)_var(--uv-spot-y,50%),color-mix(in_oklab,var(--primary)_9%,transparent),transparent_70%)] hover:before:opacity-100',
        props.class,
    )" @pointermove="handlePointerMove">
        <slot />
    </div>
</template>