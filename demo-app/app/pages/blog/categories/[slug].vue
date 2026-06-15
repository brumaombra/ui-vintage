<script setup lang="ts">
import { computed } from 'vue';
import { BlogSectionTitle, PostsList } from '@brumaombra/ui-vintage/blog';
import { getBlogCategory, getPostsByCategory } from '~/composables/useDemoBlogData.js';

const route = useRoute();

const categorySlug = computed(() => String(route.params.slug || ''));
const category = computed(() => getBlogCategory(categorySlug.value));
const posts = computed(() => getPostsByCategory(categorySlug.value));

useHead(() => ({
    title: category.value ? `${category.value.name} Demo` : 'Category Demo'
}));
</script>

<template>
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 md:px-6 lg:px-8">
        <template v-if="category">
            <div class="space-y-3">
                <NuxtLink to="/blog/categories" class="text-sm font-semibold text-[var(--text-primary-light)] underline underline-offset-4 transition-opacity hover:opacity-70 dark:text-[var(--text-primary-dark)]">
                    Back to categories
                </NuxtLink>
                <h1 class="text-3xl font-bold text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] md:text-5xl">
                    {{ category.name }}
                </h1>
                <p class="max-w-3xl text-sm leading-relaxed text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)] md:text-base">
                    {{ category.description }}
                </p>
            </div>

            <section class="space-y-5">
                <BlogSectionTitle :title="`${posts.length} posts in this category`" />
                <PostsList :posts="posts" />
            </section>
        </template>

        <template v-else>
            <div class="space-y-3">
                <NuxtLink to="/blog/categories" class="text-sm font-semibold text-[var(--text-primary-light)] underline underline-offset-4 transition-opacity hover:opacity-70 dark:text-[var(--text-primary-dark)]">
                    Back to categories
                </NuxtLink>
                <h1 class="text-3xl font-bold text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)]">
                    Category not found
                </h1>
                <p class="text-sm text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]">
                    The selected category does not exist in the static demo dataset.
                </p>
            </div>
        </template>
    </div>
</template>