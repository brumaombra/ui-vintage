<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import BackgroundGrid from "@/components/background-grid/BackgroundGrid.vue";
import { cn } from "@/lib/utils";

interface LandingShellProps {
    showBackground?: boolean;
    rootClass?: HTMLAttributes["class"];
    navbarClass?: HTMLAttributes["class"];
    mainClass?: HTMLAttributes["class"];
    contentContainerClass?: HTMLAttributes["class"];
    footerClass?: HTMLAttributes["class"];
}

// Props
const props = withDefaults(defineProps<LandingShellProps>(), {
    showBackground: true
});
</script>

<template>
    <div :class="cn('relative flex min-h-screen flex-col bg-background text-foreground', props.rootClass)">
        <!-- Background grid -->
        <BackgroundGrid v-if="props.showBackground" />

        <!-- Navbar -->
        <header :class="cn('relative z-10', props.navbarClass)">
            <slot name="navbar" />
        </header>

        <!-- Main content -->
        <main :class="cn('relative z-10 flex-1', props.mainClass)">
            <div :class="cn('mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 lg:px-8 lg:py-14', props.contentContainerClass)">
                <slot name="content">
                    <slot />
                </slot>
            </div>
        </main>

        <!-- Footer -->
        <footer :class="cn('relative z-10', props.footerClass)">
            <slot name="footer" />
        </footer>
    </div>
</template>