<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface LandingContentProps {
    class?: HTMLAttributes["class"];
}

// Props
const props = defineProps<LandingContentProps>();
</script>

<template>
    <div :class="cn('mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 lg:px-8 lg:py-14', props.class)">
        <slot />
    </div>
</template>