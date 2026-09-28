<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';
import { getUiVintageRuntimeMessage } from '../../../lib/i18n';
import { cn } from '../../../lib/utils';

// Props
const props = withDefaults(defineProps<{
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    label?: string;
    class?: HTMLAttributes['class'];
}>(), {
    size: 'md',
    label: ''
});

const resolvedLabel = computed(() => props.label || getUiVintageRuntimeMessage('uiVintage.buttons.loading', 'Loading'));

// Size classes
const sizeClasses: Record<NonNullable<typeof props.size>, string> = {
    xs: 'size-3',
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-8',
    xl: 'size-12'
};
</script>

<template>
    <span data-slot="spinner" role="status" :aria-label="resolvedLabel" :class="cn('relative inline-flex shrink-0 text-current', sizeClasses[props.size], props.class)">
        <svg viewBox="0 0 24 24" fill="none" class="size-full animate-[spin_0.7s_linear_infinite]" aria-hidden="true">
            <!-- Track -->
            <circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="2.5" class="opacity-20" />

            <!-- Arc -->
            <circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="60" class="origin-center animate-[uv-spinner-dash_1.4s_ease-in-out_infinite]" />
        </svg>
    </span>
</template>

<style>
@keyframes uv-spinner-dash {
    0% { stroke-dashoffset: 56; }
    50% { stroke-dashoffset: 16; transform: rotate(135deg); }
    100% { stroke-dashoffset: 56; transform: rotate(450deg); }
}
</style>