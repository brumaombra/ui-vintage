<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { LoadMoreButton } from '../load-more-button';
import PostsList from './PostsList.vue';

const { t } = useI18n();

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
    currentPage?: number;
    postsPerPage?: number;
    totalPosts?: number;
    hasMorePosts?: boolean;
    isLoading?: boolean;
}>(), {
    posts: () => [],
    currentPage: 1,
    postsPerPage: 9,
    totalPosts: 0,
    hasMorePosts: false,
    isLoading: false
});

// Emits
const emits = defineEmits<{
    'load-more': [];
}>();

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