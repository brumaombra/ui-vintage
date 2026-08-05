<script setup lang="ts">
// Props
const props = defineProps<{
    value: Record<string, unknown>;
}>();
</script>

<template>
    <div class="blog-content">
        <ContentRenderer :value="props.value" />
    </div>
</template>

<style scoped>
.blog-content :deep(h1) {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 2rem;
}

.blog-content :deep(h2) {
    margin-top: 2rem;
    margin-bottom: 1.5rem;
}

.blog-content :deep(h2 a) {
    font-size: 1.375rem;
    font-weight: 700;
    line-height: 2rem;
    color: var(--text-primary-light);
}

:global(.dark) .blog-content :deep(h2 a) {
    color: var(--text-primary-dark);
}

.blog-content :deep(h3) {
    margin-top: 2rem;
    margin-bottom: 1rem;
}

.blog-content :deep(h3 a) {
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.75rem;
    color: var(--text-primary-light);
}

:global(.dark) .blog-content :deep(h3 a) {
    color: var(--text-primary-dark);
}

.blog-content :deep(p) {
    font-size: 15px;
    margin-top: 1rem;
    margin-bottom: 1rem;
    line-height: 1.75;
    color: var(--text-primary-light);
}

:global(.dark) .blog-content :deep(p) {
    color: var(--text-primary-dark);
}

.blog-content :deep(p strong) {
    font-weight: 700;
}

.blog-content :deep(blockquote strong) {
    font-weight: 700;
}

.blog-content :deep(a) {
    text-decoration: none;
    font-weight: 700;
}

.blog-content :deep(a:hover) {
    text-decoration: underline;
}

@media (max-width: 640px) {
    .blog-content :deep(p) {
        font-size: 13px;
        line-height: 1.75;
    }

    .blog-content :deep(h2) {
        margin-bottom: 1rem;
    }
}
</style>