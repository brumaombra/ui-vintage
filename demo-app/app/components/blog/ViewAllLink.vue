<script setup>
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';

// Props
const props = defineProps({
    to: { type: String, required: true },
    label: { type: String, required: true }
});
</script>

<template>
    <NuxtLink :to="props.to" class="group/view inline-flex items-center gap-1.5 rounded px-1 text-xs font-semibold text-primary outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45 sm:text-sm">
        {{ props.label }}
        <HugeiconsIcon :icon="ArrowRight01Icon" class="size-4 transition-[translate] duration-300 ease-spring group-hover/view:translate-x-1" />
    </NuxtLink>
</template>