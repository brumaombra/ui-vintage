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
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <!-- Post cards rise in row by row as they scroll into view -->
        <NuxtLink v-for="(post, index) in props.posts" :key="post.path" data-aos="blur-up" :data-aos-delay="(index % 3) * 90" :to="post.path" class="block h-full rounded outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45">
            <PostCard class="h-full" :image="post.image" :category="post.categoryText" :title="post.title" :description="post.description" />
        </NuxtLink>
    </div>
</template>