<script setup lang="ts">
import { ref } from 'vue';
import { PaintBoardIcon, PlayIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Button } from '@brumaombra/ui-vintage/button';
import { Card } from '@brumaombra/ui-vintage/card';
import { showMessageToast } from '@brumaombra/ui-vintage/message-toast';
import DemoPageHeader from '~/components/demo/DemoPageHeader.vue';
import DemoSection from '~/components/demo/DemoSection.vue';

definePageMeta({ layout: 'dashboard' });

// Semantic color tokens (they switch automatically in dark mode)
const colorTokens = [
    { name: 'background', utility: 'bg-background' },
    { name: 'card', utility: 'bg-card' },
    { name: 'surface', utility: 'bg-surface' },
    { name: 'accent', utility: 'bg-accent' },
    { name: 'border', utility: 'bg-border' },
    { name: 'border-strong', utility: 'bg-border-strong' },
    { name: 'muted-foreground', utility: 'bg-muted-foreground' },
    { name: 'foreground', utility: 'bg-foreground' },
    { name: 'primary', utility: 'bg-primary' },
    { name: 'primary-hover', utility: 'bg-primary-hover' },
    { name: 'success', utility: 'bg-success' },
    { name: 'warning', utility: 'bg-warning' },
    { name: 'info', utility: 'bg-info' },
    { name: 'destructive', utility: 'bg-destructive' }
];

// Easing curves available as Tailwind utilities
const easings = [
    { name: 'ease-spring', utility: 'ease-spring', usage: 'Transforms, indicators, panels' },
    { name: 'ease-bounce', utility: 'ease-bounce', usage: 'Pops, checkmarks, dots' },
    { name: 'ease-out-expo', utility: 'ease-out-expo', usage: 'Fades, fills, reveals' },
    { name: 'ease-snappy', utility: 'ease-snappy', usage: 'Exits and dismissals' }
];
const motionPlayed = ref(false);

const elevations = ['shadow-elevated-sm', 'shadow-elevated-md', 'shadow-elevated-lg', 'shadow-elevated-xl', 'shadow-glow'];
const typeScale = [
    { utility: 'text-3xl font-bold', label: 'Display · 30px' },
    { utility: 'text-2xl font-bold', label: 'Heading · 24px' },
    { utility: 'text-lg font-semibold', label: 'Title · 18px' },
    { utility: 'text-sm font-semibold', label: 'Label · 14px' },
    { utility: 'text-sm', label: 'Body · 14px' },
    { utility: 'text-xs text-muted-foreground', label: 'Caption · 12px' }
];

// Copy a CSS variable reference
const handleCopy = async (name: string) => {
    await navigator.clipboard?.writeText(`var(--${name})`);
    showMessageToast({ message: `Copied var(--${name})`, type: 'success', duration: 1800 });
};

const motionCode = `<!-- Easing utilities -->
<div class="transition-transform duration-300 ease-spring hover:scale-105" />

<!-- Motion utilities for floating, modal, and collapsible surfaces -->
<PopoverContent class="uv-floating-motion" />
<div class="animate-uv-pop" />
<div class="animate-uv-fade-up" />`;
</script>

<template>
    <div class="flex flex-col gap-12">
        <DemoPageHeader eyebrow="Getting started" title="Foundations" description="Semantic tokens, a motion system, and elevation levels shared by every component. Change the theme to see all of them adapt." :icon="PaintBoardIcon" />

        <!-- Colors -->
        <DemoSection id="colors" title="Color tokens" badge="Updated" description="Semantic tokens switch in dark mode automatically. Click a swatch to copy its CSS variable.">
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                <button v-for="token in colorTokens" :key="token.name" type="button" class="group/swatch flex cursor-pointer flex-col overflow-hidden rounded border border-border bg-card text-left shadow-elevated-sm outline-none [transition:translate_300ms_var(--ease-spring),box-shadow_200ms] hover:-translate-y-1 hover:shadow-elevated-lg focus-visible:ring-[3px] focus-visible:ring-ring/45 active:translate-y-0" @click="handleCopy(token.name)">
                    <span :class="['h-16 w-full border-b border-border transition-[height] duration-300 ease-spring group-hover/swatch:h-20', token.utility]" />
                    <span class="flex flex-col gap-0.5 p-2.5">
                        <span class="truncate text-xs font-semibold">{{ token.name }}</span>
                        <span class="truncate text-[10px] text-muted-foreground">--{{ token.name }}</span>
                    </span>
                </button>
            </div>
        </DemoSection>

        <!-- Motion -->
        <DemoSection id="motion" title="Motion curves" badge="New" description="Four easing curves power every animation. Springs are CSS linear() curves, so they are GPU-friendly and need zero JavaScript." :code="motionCode">
            <div class="flex flex-col gap-5">
                <div v-for="easing in easings" :key="easing.name" class="grid items-center gap-3 sm:grid-cols-[160px_1fr]">
                    <div>
                        <div class="text-xs font-semibold">{{ easing.name }}</div>
                        <div class="text-[11px] text-muted-foreground">{{ easing.usage }}</div>
                    </div>
                    <div class="relative h-10 rounded border border-dashed border-border bg-surface/50">
                        <div :class="['absolute top-1/2 left-1 size-8 -translate-y-1/2 rounded bg-primary shadow-glow transition-[left] duration-1000', easing.utility, motionPlayed ? 'left-[calc(100%-2.25rem)]' : 'left-1']" />
                    </div>
                </div>
                <Button class="self-start" @click="motionPlayed = !motionPlayed">
                    <HugeiconsIcon :icon="PlayIcon" />
                    {{ motionPlayed ? 'Play back' : 'Play' }}
                </Button>
            </div>
        </DemoSection>

        <!-- Elevation -->
        <DemoSection id="elevation" title="Elevation" badge="New" description="Five levels tuned for light and dark themes. Hover a tile to lift it.">
            <div class="grid grid-cols-2 gap-6 sm:grid-cols-5">
                <Card v-for="level in elevations" :key="level" :class="['items-center justify-center py-10! transition-[translate] duration-300 ease-spring hover:-translate-y-1', level]">
                    <span class="text-[11px] font-semibold text-muted-foreground">{{ level.replace('shadow-', '') }}</span>
                </Card>
            </div>
        </DemoSection>

        <!-- Typography -->
        <DemoSection id="typography" title="Typography" description="A monospace-first type scale with tabular numbers everywhere it matters.">
            <div class="flex flex-col divide-y divide-border">
                <div v-for="entry in typeScale" :key="entry.label" class="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between">
                    <span :class="entry.utility">The vintage terminal hums at 60fps</span>
                    <span class="text-[11px] text-muted-foreground">{{ entry.label }}</span>
                </div>
            </div>
        </DemoSection>
    </div>
</template>