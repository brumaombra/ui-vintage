<script setup lang="ts">
// Props
const props = defineProps({
    to: { type: String, required: true },
    text: { type: String, required: true }
});

// Emits
const emits = defineEmits(['click']);

// Handle click
const handleClick = (event: MouseEvent) => {
    emits('click', event);
};
</script>

<template>
    <NuxtLinkLocale :to="props.to" class="cursor-pointer font-medium text-[var(--text-primary-light)] hover:underline dark:text-[var(--text-primary-dark)]" @click="handleClick">
        {{ props.text }}
    </NuxtLinkLocale>
</template>