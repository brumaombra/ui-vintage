<script setup lang="ts">
import { computed } from 'vue';
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

// Get the appropriate classes
const colorClasses = computed(() => {
    // If color is not specified or is "default", use the default card styles
    if (!props.color || props.color === 'default') {
        return 'border border-border bg-card text-card-foreground shadow-elevated-sm';
    }

    // For other colors, use the corresponding surface tone classes
    return getSurfaceToneClasses(props.color);
});
</script>

<template>
    <div data-slot="card" :data-interactive="props.interactive ? '' : undefined" :class="cn(
        'relative flex flex-col gap-4 sm:gap-6! rounded py-6 transition-[border-color,box-shadow,background-color,translate] duration-300 ease-out-expo',
        colorClasses,
        props.interactive && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-elevated-md active:translate-y-0 active:duration-100',
        props.class,
    )">
        <slot />
    </div>
</template>