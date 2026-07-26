<script setup lang="ts">
import CategoriesList from './CategoriesList.vue';

// Props
const props = withDefaults(defineProps<{
    categories?: Array<{
        path: string;
        slug?: string;
        name: string;
        image?: string;
        count: number;
    }>;
}>(), {
    categories: () => []
});
</script>

<template>
    <div>
        <CategoriesList :categories="props.categories" />
    </div>
</template>