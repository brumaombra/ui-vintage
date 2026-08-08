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
.blog-content {
    --blog-content-text: var(--text-primary-light);
    --blog-content-code-bg: var(--bg-selected-light);
    color: var(--blog-content-text);
}

.dark .blog-content {
    --blog-content-text: var(--text-primary-dark);
    --blog-content-code-bg: var(--bg-selected-dark);
}

.blog-content :deep(h1:not(.not-prose):not(.not-prose *)),
.blog-content :deep(h2:not(.not-prose):not(.not-prose *)),
.blog-content :deep(h3:not(.not-prose):not(.not-prose *)) {
    color: var(--blog-content-text);
}

.blog-content :deep(h1:not(.not-prose):not(.not-prose *)) {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 2rem;
}

.blog-content :deep(h2:not(.not-prose):not(.not-prose *)) {
    margin-top: 2rem;
    margin-bottom: 1.5rem;
}

.blog-content :deep(h2:not(.not-prose):not(.not-prose *) a:not(.not-prose):not(.not-prose *)) {
    font-size: 1.375rem;
    font-weight: 700;
    line-height: 2rem;
}

.blog-content :deep(h3:not(.not-prose):not(.not-prose *)) {
    margin-top: 2rem;
    margin-bottom: 1rem;
}

.blog-content :deep(h3:not(.not-prose):not(.not-prose *) a:not(.not-prose):not(.not-prose *)) {
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.75rem;
}

.blog-content :deep(p:not(.not-prose):not(.not-prose *)),
.blog-content :deep(li:not(.not-prose):not(.not-prose *)),
.blog-content :deep(blockquote:not(.not-prose):not(.not-prose *)),
.blog-content :deep(td:not(.not-prose):not(.not-prose *)),
.blog-content :deep(th:not(.not-prose):not(.not-prose *)) {
    color: var(--blog-content-text);
}

.blog-content :deep(p:not(.not-prose):not(.not-prose *)) {
    font-size: 15px;
    margin-top: 1rem;
    margin-bottom: 1rem;
    line-height: 1.75;
}

.blog-content :deep(p:not(.not-prose):not(.not-prose *) strong:not(.not-prose):not(.not-prose *)),
.blog-content :deep(blockquote:not(.not-prose):not(.not-prose *) strong:not(.not-prose):not(.not-prose *)) {
    font-weight: 700;
}

.blog-content :deep(p:not(.not-prose):not(.not-prose *) a:not(.not-prose):not(.not-prose *)),
.blog-content :deep(li:not(.not-prose):not(.not-prose *) a:not(.not-prose):not(.not-prose *)),
.blog-content :deep(blockquote:not(.not-prose):not(.not-prose *) a:not(.not-prose):not(.not-prose *)) {
    color: var(--blog-content-text);
    text-decoration: none;
    font-weight: 700;
}

.blog-content :deep(p:not(.not-prose):not(.not-prose *) a:not(.not-prose):not(.not-prose *):hover),
.blog-content :deep(li:not(.not-prose):not(.not-prose *) a:not(.not-prose):not(.not-prose *):hover),
.blog-content :deep(blockquote:not(.not-prose):not(.not-prose *) a:not(.not-prose):not(.not-prose *):hover) {
    text-decoration: underline;
}

.blog-content :deep(p:not(.not-prose):not(.not-prose *) code:not(.not-prose):not(.not-prose *)),
.blog-content :deep(pre:not(.not-prose):not(.not-prose *) code:not(.not-prose):not(.not-prose *)) {
    color: var(--blog-content-text);
    background-color: var(--blog-content-code-bg);
}

@media (max-width: 640px) {
    .blog-content :deep(p:not(.not-prose):not(.not-prose *)) {
        font-size: 13px;
        line-height: 1.75;
    }

    .blog-content :deep(h2:not(.not-prose):not(.not-prose *)) {
        margin-bottom: 1rem;
    }
}
</style>