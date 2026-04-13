<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface LandingContentProps {
    class?: HTMLAttributes["class"];
    containerClass?: HTMLAttributes["class"];
}

// Props
const props = defineProps<LandingContentProps>();
</script>

<template>
    <main :class="cn('relative z-10 flex-1', props.class)">
        <div :class="cn('mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 lg:px-8 lg:py-14', props.containerClass)">
            <slot />
        </div>
    </main>
</template>