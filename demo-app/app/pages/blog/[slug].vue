<script setup lang="ts">
import { computed } from 'vue';
import { BlogSectionTitle, CategoryCard, PostCard } from '@brumaombra/ui-vintage/blog';
import { getBlogPost, getRelatedCategories, getRelatedPosts } from '~/composables/useDemoBlogData.js';

const route = useRoute();

const postSlug = computed(() => String(route.params.slug || ''));
const post = computed(() => getBlogPost(postSlug.value));
const relatedPosts = computed(() => getRelatedPosts(postSlug.value));
const relatedCategories = computed(() => {
    if (!post.value) {
        return [];
    }

    return getRelatedCategories(post.value.categorySlug);
});

useHead(() => ({
    title: post.value ? post.value.title : 'Blog Post Demo'
}));
</script>

<template>
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 md:px-6 lg:px-8">
        <template v-if="post">
            <header class="space-y-5">
                <NuxtLink to="/blog" class="text-sm font-semibold text-[var(--text-primary-light)] underline underline-offset-4 transition-opacity hover:opacity-70 dark:text-[var(--text-primary-dark)]">
                    Back to blog
                </NuxtLink>

                <NuxtLink :to="`/blog/categories/${post.categorySlug}`" class="inline-flex text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary-light)] transition-opacity hover:opacity-70 dark:text-[var(--text-secondary-dark)]">
                    {{ post.categoryText }}
                </NuxtLink>

                <div class="space-y-3">
                    <h1 class="max-w-4xl text-3xl font-bold leading-tight text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] md:text-5xl">
                        {{ post.title }}
                    </h1>
                    <p class="max-w-3xl text-sm leading-relaxed text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)] md:text-lg">
                        {{ post.description }}
                    </p>
                </div>

                <div class="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]">
                    <span>{{ post.publishedAt }}</span>
                    <span>{{ post.readTime }}</span>
                </div>

                <div class="overflow-hidden rounded border border-[var(--border-light)] bg-[var(--bg-card-light)] dark:border-[var(--border-dark)] dark:bg-[var(--bg-card-dark)]">
                    <img :src="post.image" :alt="post.title" class="h-72 w-full object-cover md:h-[26rem]">
                </div>
            </header>

            <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
                <article class="space-y-8">
                    <section v-for="section in post.sections" :key="section.title" class="space-y-3">
                        <h2 class="text-2xl font-bold text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)]">
                            {{ section.title }}
                        </h2>
                        <p v-for="paragraph in section.paragraphs" :key="paragraph" class="text-sm leading-7 text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)] md:text-base">
                            {{ paragraph }}
                        </p>
                    </section>
                </article>

                <aside class="rounded border border-[var(--border-light)] bg-[var(--bg-card-light)] p-5 dark:border-[var(--border-dark)] dark:bg-[var(--bg-card-dark)]">
                    <h2 class="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]">
                        Key takeaways
                    </h2>
                    <ul class="space-y-3 text-sm leading-6 text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)]">
                        <li v-for="point in post.keyPoints" :key="point">
                            {{ point }}
                        </li>
                    </ul>
                </aside>
            </div>

            <section class="space-y-5" v-if="relatedPosts.length > 0">
                <BlogSectionTitle title="Read also" />
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <NuxtLink v-for="relatedPost in relatedPosts" :key="relatedPost.path" :to="relatedPost.path" class="block h-full">
                        <PostCard
                            class="h-full"
                            :image="relatedPost.image"
                            :category="relatedPost.categoryText"
                            :title="relatedPost.title"
                            :description="relatedPost.description"
                        />
                    </NuxtLink>
                </div>
            </section>

            <section class="space-y-5" v-if="relatedCategories.length > 0">
                <BlogSectionTitle title="Explore categories" />
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <NuxtLink v-for="category in relatedCategories" :key="category.slug" :to="`/blog/categories/${category.slug}`" class="block h-full">
                        <CategoryCard
                            :name="category.name"
                            :image="category.image"
                            :count="category.count"
                        />
                    </NuxtLink>
                </div>
            </section>
        </template>

        <template v-else>
            <div class="space-y-3">
                <NuxtLink to="/blog" class="text-sm font-semibold text-[var(--text-primary-light)] underline underline-offset-4 transition-opacity hover:opacity-70 dark:text-[var(--text-primary-dark)]">
                    Back to blog
                </NuxtLink>
                <h1 class="text-3xl font-bold text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)]">
                    Post not found
                </h1>
                <p class="text-sm text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]">
                    The selected post does not exist in the static demo dataset.
                </p>
            </div>
        </template>
    </div>
</template>