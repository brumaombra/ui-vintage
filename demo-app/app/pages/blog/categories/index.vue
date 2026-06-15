<script setup lang="ts">
import { CategoriesList } from '@brumaombra/ui-vintage/blog';
import { useBlogCategories } from '~/composables/useDemoBlogData.js';

const blogCategories = useBlogCategories();

useHead({
    title: 'Blog Categories Demo'
});
</script>

<template>
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 md:px-6 lg:px-8">
        <div class="space-y-3">
            <NuxtLink to="/blog" class="text-sm font-semibold text-[var(--text-primary-light)] underline underline-offset-4 transition-opacity hover:opacity-70 dark:text-[var(--text-primary-dark)]">
                Back to blog
            </NuxtLink>
            <h1 class="text-3xl font-bold text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] md:text-5xl">
                Browse every category
            </h1>
            <p class="max-w-3xl text-sm leading-relaxed text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)] md:text-base">
                This route showcases the direct categories list component with the same fixed data used across the rest of the demo blog.
            </p>
        </div>

        <CategoriesList :categories="blogCategories" />
    </div>
</template>