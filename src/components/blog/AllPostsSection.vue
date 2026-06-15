<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { LoadMoreButton } from '@/components/load-more-button';
import PostsList from './PostsList.vue';

const { t } = useI18n();

// Props
const props = defineProps({
    posts: { type: Array, default: () => [] },
    currentPage: { type: Number, default: 1 },
    postsPerPage: { type: Number, default: 9 },
    totalPosts: { type: Number, default: 0 },
    hasMorePosts: { type: Boolean, default: false },
    isLoading: { type: Boolean, default: false }
});

// Emits
const emits = defineEmits(['load-more']);

// Handle load more posts
const handleLoadMorePosts = () => {
    if (!props.isLoading) {
        emits('load-more');
    }
};

// Number of currently visible posts
const visiblePostsCount = computed(() => Math.min(props.posts.length, props.totalPosts));
</script>

<template>
    <div>
        <!-- Blog posts grid -->
        <PostsList :posts="props.posts" />

        <!-- Load more button -->
        <LoadMoreButton v-if="props.hasMorePosts"
            :busy="props.isLoading"
            :text="t('uiVintage.blog.loadMoreWithNumbers', { current: visiblePostsCount, total: props.totalPosts })"
            @load-more="handleLoadMorePosts"
            class="mt-8"
            data-aos="fade-up" />
    </div>
</template>