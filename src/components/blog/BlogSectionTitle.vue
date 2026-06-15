<script setup>
// Props
const props = defineProps({
    title: { type: String, required: true }
});
</script>

<template>
    <h2 class="text-xl md:text-2xl font-bold text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] mb-5">
        {{ props.title }}
    </h2>
</template>