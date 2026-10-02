<script setup lang="ts">
import { computed, useSlots, type HTMLAttributes } from 'vue';
import BackgroundGrid from '../../background-grid/BackgroundGrid.vue';
import { cn } from '../../../lib/utils';

// Props
const props = withDefaults(defineProps<{
    showBackground?: boolean;
    rootClass?: HTMLAttributes['class'];
    navbarClass?: HTMLAttributes['class'];
    mainClass?: HTMLAttributes['class'];
    footerClass?: HTMLAttributes['class'];
}>(), {
    showBackground: true
});

const slots = useSlots();

// Determine if any structured slots are provided.
const hasStructuredSlots = computed(() => {
    return Boolean(slots.navbar || slots.content || slots.footer);
});
</script>

<template>
    <div :class="cn('relative flex min-h-screen flex-col bg-background text-foreground', props.rootClass)">
        <!-- Background grid and a warm ambient glow at the top -->
        <template v-if="props.showBackground">
            <BackgroundGrid />
            <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 z-0 h-[36rem] overflow-hidden">
                <div class="absolute -top-48 left-1/2 h-96 w-[56rem] max-w-[140%] -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]" />
            </div>
        </template>

        <!-- If structured slots are provided, render them -->
        <template v-if="hasStructuredSlots">
            <!-- Navbar -->
            <div :class="cn('contents', props.navbarClass)">
                <slot name="navbar" />
            </div>

            <!-- Main content -->
            <main :class="cn('relative z-10 flex-1', props.mainClass)">
                <slot name="content">
                    <slot />
                </slot>
            </main>

            <!-- Footer -->
            <footer :class="cn('relative z-10', props.footerClass)">
                <slot name="footer" />
            </footer>
        </template>

        <!-- If no structured slots, render default slot directly -->
        <template v-else>
            <slot />
        </template>
    </div>
</template>