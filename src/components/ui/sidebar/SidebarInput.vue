<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';
import { Input } from '../input';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <Input data-slot="sidebar-input" data-sidebar="input" :class="cn(
        'bg-background h-8 w-full shadow-none group-data-[compact=true]/sidebar-wrapper:h-7 group-data-[compact=true]/sidebar-wrapper:text-xs',
        props.class
    )
        ">
        <slot />
    </Input>
</template>