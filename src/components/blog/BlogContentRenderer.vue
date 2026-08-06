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
    color: var(--text-primary-light);
}

:global(html.dark) .blog-content {
    color: var(--text-primary-dark);
}

.blog-content :deep(h1:not(.not-prose):not(.not-prose *)),
.blog-content :deep(h2:not(.not-prose):not(.not-prose *)),
.blog-content :deep(h3:not(.not-prose):not(.not-prose *)) {
    color: var(--text-primary-light);
}

:global(html.dark) .blog-content :deep(h1:not(.not-prose):not(.not-prose *)),
:global(html.dark) .blog-content :deep(h2:not(.not-prose):not(.not-prose *)),
:global(html.dark) .blog-content :deep(h3:not(.not-prose):not(.not-prose *)) {
    color: var(--text-primary-dark) !important;
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
    color: var(--text-primary-light);
}

:global(html.dark) .blog-content :deep(p:not(.not-prose):not(.not-prose *)),
:global(html.dark) .blog-content :deep(li:not(.not-prose):not(.not-prose *)),
:global(html.dark) .blog-content :deep(blockquote:not(.not-prose):not(.not-prose *)),
:global(html.dark) .blog-content :deep(td:not(.not-prose):not(.not-prose *)),
:global(html.dark) .blog-content :deep(th:not(.not-prose):not(.not-prose *)) {
    color: var(--text-primary-dark) !important;
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
    color: var(--text-primary-light);
    text-decoration: none;
    font-weight: 700;
}

:global(html.dark) .blog-content :deep(p:not(.not-prose):not(.not-prose *) a:not(.not-prose):not(.not-prose *)),
:global(html.dark) .blog-content :deep(li:not(.not-prose):not(.not-prose *) a:not(.not-prose):not(.not-prose *)),
:global(html.dark) .blog-content :deep(blockquote:not(.not-prose):not(.not-prose *) a:not(.not-prose):not(.not-prose *)) {
    color: var(--text-primary-dark) !important;
}

.blog-content :deep(p:not(.not-prose):not(.not-prose *) a:not(.not-prose):not(.not-prose *):hover),
.blog-content :deep(li:not(.not-prose):not(.not-prose *) a:not(.not-prose):not(.not-prose *):hover),
.blog-content :deep(blockquote:not(.not-prose):not(.not-prose *) a:not(.not-prose):not(.not-prose *):hover) {
    text-decoration: underline;
}

.blog-content :deep(p:not(.not-prose):not(.not-prose *) code:not(.not-prose):not(.not-prose *)),
.blog-content :deep(pre:not(.not-prose):not(.not-prose *) code:not(.not-prose):not(.not-prose *)) {
    color: var(--text-primary-light);
    background-color: var(--bg-selected-light);
}

:global(html.dark) .blog-content :deep(p:not(.not-prose):not(.not-prose *) code:not(.not-prose):not(.not-prose *)),
:global(html.dark) .blog-content :deep(pre:not(.not-prose):not(.not-prose *) code:not(.not-prose):not(.not-prose *)) {
    color: var(--text-primary-dark) !important;
    background-color: var(--bg-selected-dark);
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