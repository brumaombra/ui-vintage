<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
    pressed?: boolean;
}>();
</script>

<template>
    <kbd data-slot="kbd" :data-pressed="props.pressed ? '' : undefined" :class="cn(
        'inline-flex h-5 min-w-5 select-none items-center justify-center gap-1 rounded-sm border border-b-2 border-border bg-surface px-1.5 font-mono text-[11px] leading-none font-semibold text-muted-foreground shadow-elevated-sm transition-[translate,border-width,box-shadow] duration-100 ease-snappy [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-3',
        'data-pressed:translate-y-px data-pressed:border-b data-pressed:shadow-none',
        props.class
    )
        ">
        <slot />
    </kbd>
</template>