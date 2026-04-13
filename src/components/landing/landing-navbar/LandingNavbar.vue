<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface LandingNavbarProps {
    class?: HTMLAttributes["class"];
    containerClass?: HTMLAttributes["class"];
    leftClass?: HTMLAttributes["class"];
    rightClass?: HTMLAttributes["class"];
}

// Props
const props = defineProps<LandingNavbarProps>();
</script>

<template>
    <header :class="cn('z-30 flex h-20 w-full flex-wrap sm:flex-nowrap sm:justify-start', props.class)">
        <nav :class="cn('mx-auto flex max-w-6xl basis-full items-center justify-between px-3 sm:px-6 lg:px-8', props.containerClass)">
            <!-- Left-aligned content -->
            <div :class="cn('flex items-center', props.leftClass)">
                <slot name="left" />
            </div>

            <!-- Right-aligned content -->
            <div :class="cn('flex items-center justify-end gap-3', props.rightClass)">
                <slot name="right" />
            </div>
        </nav>
    </header>
</template>