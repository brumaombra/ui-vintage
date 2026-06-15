<script setup>
import CategoriesList from './CategoriesList.vue';

// Props
const props = defineProps({
    categories: { type: Array, default: () => [] }
});
</script>

<template>
    <div>
        <CategoriesList :categories="props.categories" />
    </div>
</template>