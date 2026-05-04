<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { computed, useSlots } from "vue";
import BackgroundGrid from "@/components/background-grid/BackgroundGrid.vue";
import { cn } from "@/lib/utils";

interface LandingShellProps {
    showBackground?: boolean;
    rootClass?: HTMLAttributes["class"];
    navbarClass?: HTMLAttributes["class"];
    mainClass?: HTMLAttributes["class"];
    footerClass?: HTMLAttributes["class"];
}

// Props
const props = withDefaults(defineProps<LandingShellProps>(), {
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
        <!-- Background grid -->
        <BackgroundGrid v-if="props.showBackground" />

        <!-- If structured slots are provided, render them -->
        <template v-if="hasStructuredSlots">
            <!-- Navbar -->
            <header :class="cn('relative z-10', props.navbarClass)">
                <slot name="navbar" />
            </header>

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