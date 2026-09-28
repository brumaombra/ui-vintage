<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { getSurfaceToneClasses, type ToneColor } from '../../../lib/color-tokens';
import { cn } from '../../../lib/utils';
import type { HugeiconsIconDefinition } from '../../../lib/common-types';

// Props
const props = withDefaults(defineProps<{
    text: string;
    icon?: HugeiconsIconDefinition | null;
    color?: ToneColor;
    dot?: boolean;
    pulse?: boolean;
    class?: HTMLAttributes['class'];
}>(), {
    icon: null,
    color: 'gray',
    dot: false,
    pulse: false
});
</script>

<template>
    <span data-slot="badge" :class="cn('inline-flex w-fit items-center justify-center gap-1.5 whitespace-nowrap rounded border px-2 py-0.5 text-xs font-semibold transition-colors duration-150', getSurfaceToneClasses(props.color), props.class)">
        <!-- Status dot -->
        <span v-if="props.dot || props.pulse" class="relative flex size-1.5 shrink-0">
            <span v-if="props.pulse" class="absolute inset-0 animate-uv-ping-soft rounded-full bg-current" />
            <span class="relative size-1.5 rounded-full bg-current" />
        </span>

        <!-- Icon -->
        <HugeiconsIcon v-if="props.icon" :icon="props.icon" class="size-3.5 shrink-0" :stroke-width="1.8" />
        {{ props.text }}
    </span>
</template>