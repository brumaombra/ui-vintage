<script setup lang="ts">
import PostCard from './PostCard.vue';

// Props
const props = withDefaults(defineProps<{
    posts?: Array<{
        path: string;
        title: string;
        description?: string;
        image?: string;
        categoryText?: string;
        categoryPath?: string;
    }>;
}>(), {
    posts: () => []
});
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink v-for="(post, index) in props.posts" :key="post.path" :to="post.path" class="block h-full" data-aos="fade-up" :data-aos-delay="(index % 3) * 200">
            <PostCard class="h-full" :image="post.image" :category="post.categoryText" :title="post.title" :description="post.description" />
        </NuxtLink>
    </div>
</template>