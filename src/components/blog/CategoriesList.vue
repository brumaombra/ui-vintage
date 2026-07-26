<script setup lang="ts">
import CategoryCard from './CategoryCard.vue';

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
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
        <!-- Category card -->
        <NuxtLink v-for="(category, i) in props.categories" :key="category.path || category.slug" :to="category.path" class="block h-full" data-aos="fade-up" :data-aos-delay="(i % 4) * 200">
            <CategoryCard :name="category.name" :image="category.image" :count="category.count" />
        </NuxtLink>
    </div>
</template>