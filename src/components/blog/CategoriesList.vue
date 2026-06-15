<script setup>
import CategoryCard from './CategoryCard.vue';

// Props
const props = defineProps({
    categories: { type: Array, default: () => [] }
});
</script>

<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
        <!-- Category card -->
        <NuxtLinkLocale v-for="(category, i) in props.categories" :key="category.slug" :to="`/blog/categories/${category.slug}`" class="block h-full" data-aos="fade-up" :data-aos-delay="(i % 4) * 200">
            <CategoryCard :name="category.name" :image="category.image" :count="category.count" />
        </NuxtLinkLocale>
    </div>
</template>