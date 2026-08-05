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

:global(.dark) .blog-content {
    color: var(--text-primary-dark);
}

.blog-content :deep(h1),
.blog-content :deep(h2),
.blog-content :deep(h3) {
    color: var(--text-primary-light);
}

:global(.dark) .blog-content :deep(h1),
:global(.dark) .blog-content :deep(h2),
:global(.dark) .blog-content :deep(h3) {
    color: var(--text-primary-dark);
}

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
}

.blog-content :deep(h3) {
    margin-top: 2rem;
    margin-bottom: 1rem;
}

.blog-content :deep(h3 a) {
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.75rem;
}

.blog-content :deep(p),
.blog-content :deep(li),
.blog-content :deep(blockquote),
.blog-content :deep(td),
.blog-content :deep(th) {
    color: var(--text-primary-light);
}

:global(.dark) .blog-content :deep(p),
:global(.dark) .blog-content :deep(li),
:global(.dark) .blog-content :deep(blockquote),
:global(.dark) .blog-content :deep(td),
:global(.dark) .blog-content :deep(th) {
    color: var(--text-primary-dark);
}

.blog-content :deep(p) {
    font-size: 15px;
    margin-top: 1rem;
    margin-bottom: 1rem;
    line-height: 1.75;
}

.blog-content :deep(p strong),
.blog-content :deep(blockquote strong) {
    font-weight: 700;
}

.blog-content :deep(a) {
    color: var(--text-primary-light);
    text-decoration: none;
    font-weight: 700;
}

:global(.dark) .blog-content :deep(a) {
    color: var(--text-primary-dark);
}

.blog-content :deep(a:hover) {
    text-decoration: underline;
}

.blog-content :deep(code) {
    color: var(--text-primary-light);
    background-color: var(--bg-selected-light);
}

:global(.dark) .blog-content :deep(code) {
    color: var(--text-primary-dark);
    background-color: var(--bg-selected-dark);
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