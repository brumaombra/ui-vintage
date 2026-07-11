<script setup lang="ts">
import { NuxtImg } from "#components";
import type { HTMLAttributes } from "vue";
import { cn } from "../../../lib/utils";

interface LandingNavbarProps {
    appName?: string;
    appLogo?: string;
    appLinkTo?: string;
    logoClass?: HTMLAttributes["class"];
    class?: HTMLAttributes["class"];
    containerClass?: HTMLAttributes["class"];
    leftClass?: HTMLAttributes["class"];
    rightClass?: HTMLAttributes["class"];
}

// Props
const props = withDefaults(defineProps<LandingNavbarProps>(), {
    appName: "",
    appLogo: "",
    appLinkTo: "/"
});
</script>

<template>
    <header :class="cn('z-30 flex h-20 w-full flex-wrap sm:flex-nowrap sm:justify-start', props.class)">
        <nav :class="cn('mx-auto flex max-w-6xl basis-full items-center justify-between px-3 sm:px-6 lg:px-8', props.containerClass)">
            <!-- Left-aligned content -->
            <div :class="cn('flex items-center', props.leftClass)">
                <slot name="left">
                    <a :href="props.appLinkTo" class="inline-flex items-center gap-2 transition-opacity hover:opacity-80">
                        <!-- App logo -->
                        <NuxtImg v-if="props.appLogo" :src="props.appLogo" :alt="`${props.appName} logo`" width="44" height="44" :sizes="{ 320: '44px', 640: '36px' }" loading="eager" fetchpriority="high" :class="cn('size-11 sm:size-9 shrink-0 object-contain', props.logoClass)" />

                        <!-- App name -->
                        <span v-if="props.appName" class="hidden sm:inline! text-xl font-bold tracking-tight text-foreground">
                            {{ props.appName }}
                        </span>
                    </a>
                </slot>
            </div>

            <!-- Right-aligned content -->
            <div :class="cn('flex items-center justify-end gap-2 sm:gap-3', props.rightClass)">
                <slot name="right" />
            </div>
        </nav>
    </header>
</template>