<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { getUiVintageRuntimeMessage } from '../../../lib/i18n';
import { cn } from '../../../lib/utils';
import { Spinner } from '../spinner';

// Props
const props = withDefaults(defineProps<{
    show?: boolean;
    label?: string;
    class?: HTMLAttributes['class'];
    overlayClass?: HTMLAttributes['class'];
}>(), {
    show: false
});

const resolvedLabel = computed(() => props.label || getUiVintageRuntimeMessage('uiVintage.common.loading.title', 'Loading...'));
</script>

<template>
    <Transition name="uv-busy">
        <div v-if="props.show" data-slot="busy-overlay" :class="cn(
            'fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[3px] dark:bg-black/60',
            props.overlayClass,
        )">
            <div data-slot="busy-content" role="status" aria-live="polite" aria-busy="true" :class="cn(
                'uv-busy-card bg-card text-card-foreground flex w-72 flex-col items-center justify-center gap-4 rounded border border-border px-8 py-7 text-center shadow-elevated-xl',
                props.class,
            )">
                <slot>
                    <!-- Spinner -->
                    <Spinner data-slot="busy-spinner" size="xl" class="text-primary" />

                    <!-- Label -->
                    <span v-if="resolvedLabel" data-slot="busy-label" class="text-xs font-semibold text-foreground sm:text-sm">
                        {{ resolvedLabel }}
                    </span>
                </slot>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.uv-busy-enter-active {
    transition: opacity 0.25s var(--ease-out-expo);
}

.uv-busy-leave-active {
    transition: opacity 0.18s var(--ease-snappy);
}

.uv-busy-enter-from,
.uv-busy-leave-to {
    opacity: 0;
}

.uv-busy-enter-active .uv-busy-card {
    transition: transform 0.45s var(--ease-spring), filter 0.3s var(--ease-out-expo);
}

.uv-busy-leave-active .uv-busy-card {
    transition: transform 0.18s var(--ease-snappy);
}

.uv-busy-enter-from .uv-busy-card {
    transform: translateY(10px) scale(0.92);
    filter: blur(4px);
}

.uv-busy-leave-to .uv-busy-card {
    transform: scale(0.96);
}
</style>