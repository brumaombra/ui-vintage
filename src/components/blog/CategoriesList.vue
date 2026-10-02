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
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        <!-- Category card -->
        <NuxtLink v-for="(category, index) in props.categories" :key="category.path || category.slug" data-aos="blur-up" :data-aos-delay="(index % 4) * 80" :to="category.path" class="block h-full rounded outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45">
            <CategoryCard :name="category.name" :image="category.image" :count="category.count" />
        </NuxtLink>
    </div>
</template>