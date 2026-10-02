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
    color: var(--foreground);
}

/* Headings */
.blog-content :deep(h1:not(.not-prose):not(.not-prose *)),
.blog-content :deep(h2:not(.not-prose):not(.not-prose *)),
.blog-content :deep(h3:not(.not-prose):not(.not-prose *)) {
    color: var(--foreground);
    letter-spacing: -0.01em;
    scroll-margin-top: 6rem;
}

.blog-content :deep(h1:not(.not-prose):not(.not-prose *)) {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 2rem;
}

.blog-content :deep(h2:not(.not-prose):not(.not-prose *)) {
    margin-top: 3rem;
    margin-bottom: 1.25rem;
}

.blog-content :deep(h3:not(.not-prose):not(.not-prose *)) {
    margin-top: 2.25rem;
    margin-bottom: 1rem;
}

.blog-content :deep(h2:not(.not-prose):not(.not-prose *) a:not(.not-prose):not(.not-prose *)) {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 2rem;
}

.blog-content :deep(h3:not(.not-prose):not(.not-prose *) a:not(.not-prose):not(.not-prose *)) {
    font-size: 1.15rem;
    font-weight: 700;
    line-height: 1.75rem;
}

/* Heading anchors: a "#" fades in on hover */
.blog-content :deep(:is(h2, h3):not(.not-prose):not(.not-prose *) > a) {
    position: relative;
    color: inherit;
    text-decoration: none;
}

.blog-content :deep(:is(h2, h3):not(.not-prose):not(.not-prose *) > a::before) {
    content: '#';
    position: absolute;
    left: -1.1em;
    color: var(--primary);
    opacity: 0;
    translate: 4px 0;
    transition: opacity 0.2s var(--ease-out-expo), translate 0.3s var(--ease-spring);
}

.blog-content :deep(:is(h2, h3):not(.not-prose):not(.not-prose *):hover > a::before) {
    opacity: 1;
    translate: 0 0;
}

/* Body text */
.blog-content :deep(p:not(.not-prose):not(.not-prose *)),
.blog-content :deep(li:not(.not-prose):not(.not-prose *)),
.blog-content :deep(blockquote:not(.not-prose):not(.not-prose *)),
.blog-content :deep(td:not(.not-prose):not(.not-prose *)),
.blog-content :deep(th:not(.not-prose):not(.not-prose *)) {
    color: var(--foreground);
}

.blog-content :deep(p:not(.not-prose):not(.not-prose *)) {
    font-size: 15px;
    margin-top: 1rem;
    margin-bottom: 1rem;
    line-height: 1.85;
}

/* Lede: the opening paragraph reads a little larger */
.blog-content :deep(p:not(.not-prose):not(.not-prose *):first-of-type) {
    font-size: 17px;
    line-height: 1.8;
    color: var(--muted-foreground);
}

.blog-content :deep(:is(p, blockquote, li):not(.not-prose):not(.not-prose *) strong) {
    font-weight: 700;
    color: var(--foreground);
}

/* Links: a primary underline that thickens on hover */
.blog-content :deep(:is(p, li, blockquote):not(.not-prose):not(.not-prose *) a:not(.not-prose):not(.not-prose *)) {
    color: var(--foreground);
    font-weight: 700;
    text-decoration: underline;
    text-decoration-color: color-mix(in oklab, var(--primary) 45%, transparent);
    text-decoration-thickness: 2px;
    text-underline-offset: 4px;
    transition: color 0.15s, text-decoration-color 0.15s, text-decoration-thickness 0.15s;
}

.blog-content :deep(:is(p, li, blockquote):not(.not-prose):not(.not-prose *) a:not(.not-prose):not(.not-prose *):hover) {
    color: var(--primary);
    text-decoration-color: var(--primary);
    text-decoration-thickness: 3px;
}

/* Lists */
.blog-content :deep(:is(ul, ol):not(.not-prose):not(.not-prose *)) {
    margin: 1.25rem 0;
    padding-left: 1.4rem;
}

.blog-content :deep(ul:not(.not-prose):not(.not-prose *)) {
    list-style: square;
}

.blog-content :deep(ol:not(.not-prose):not(.not-prose *)) {
    list-style: decimal;
}

.blog-content :deep(li:not(.not-prose):not(.not-prose *)) {
    font-size: 15px;
    line-height: 1.8;
    margin: 0.4rem 0;
    padding-left: 0.25rem;
}

.blog-content :deep(li:not(.not-prose):not(.not-prose *)::marker) {
    color: var(--primary);
    font-weight: 700;
}

/* Blockquotes */
.blog-content :deep(blockquote:not(.not-prose):not(.not-prose *)) {
    position: relative;
    margin: 2rem 0;
    padding: 1rem 1.25rem 1rem 1.5rem;
    border: 1px solid var(--border);
    border-left: 3px solid var(--primary);
    border-radius: var(--radius-sm);
    background-color: var(--surface);
    font-size: 15px;
    font-style: italic;
    line-height: 1.8;
}

.blog-content :deep(blockquote:not(.not-prose):not(.not-prose *) p) {
    margin: 0;
}

/* Inline code */
.blog-content :deep(:is(p, li, blockquote, td, th):not(.not-prose):not(.not-prose *) code:not(.not-prose):not(.not-prose *)) {
    color: var(--foreground);
    background-color: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.25rem;
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1rem;
    padding: 0.125rem 0.5rem;
    white-space: nowrap;
}

.blog-content :deep(pre:not(.not-prose):not(.not-prose *) code:not(.not-prose):not(.not-prose *)) {
    color: var(--foreground);
    background-color: var(--accent);
}

/* Images */
.blog-content :deep(img:not(.not-prose):not(.not-prose *)) {
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    box-shadow: var(--uv-shadow-md);
}

/* Plain markdown tables */
.blog-content :deep(table:not(.not-prose):not(.not-prose *)) {
    width: 100%;
    margin: 2rem 0;
    border-collapse: collapse;
    font-size: 14px;
}

.blog-content :deep(:is(th, td):not(.not-prose):not(.not-prose *)) {
    border-bottom: 1px solid var(--border);
    padding: 0.65rem 0.75rem;
    text-align: left;
}

.blog-content :deep(th:not(.not-prose):not(.not-prose *)) {
    background-color: var(--surface);
    font-weight: 700;
}

@media (max-width: 640px) {
    .blog-content :deep(:is(p, li):not(.not-prose):not(.not-prose *)) {
        font-size: 14px;
        line-height: 1.8;
    }

    .blog-content :deep(p:not(.not-prose):not(.not-prose *):first-of-type) {
        font-size: 15px;
    }

    .blog-content :deep(h2:not(.not-prose):not(.not-prose *)) {
        margin-top: 2.25rem;
        margin-bottom: 1rem;
    }
}
</style>