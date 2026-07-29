<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
    variant?: 'legend' | 'label';
}>();
</script>

<template>
    <legend data-slot="field-legend" :data-variant="variant" :class="cn(
        'mb-3 font-semibold',
        'data-[variant=legend]:text-base',
        'data-[variant=label]:text-sm',
        props.class,
    )
        ">
        <slot />
    </legend>
</template>