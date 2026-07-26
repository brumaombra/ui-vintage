<script setup lang="ts">
// Props
const props = defineProps<{
    title: string;
}>();
</script>

<template>
    <h2 class="text-xl md:text-2xl font-bold text-(--text-primary-light) dark:text-(--text-primary-dark) mb-5">
        {{ props.title }}
    </h2>
</template>