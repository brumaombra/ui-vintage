<script setup lang="ts">
// Props
const props = withDefaults(defineProps<{
    tags?: Array<{
        name: string;
        slug: string;
        count: number;
    }>;
    blogPath?: string;
}>(), {
    tags: () => [],
    blogPath: '/blog'
});
</script>

<template>
    <div v-if="props.tags.length" class="flex flex-wrap gap-2">
        <!-- Tag chip -->
        <span v-for="(tag, index) in props.tags" :key="tag.slug" data-aos="blur-up" :data-aos-delay="Math.min(index * 40, 400)" class="inline-flex">
            <NuxtLinkLocale :to="`${props.blogPath}/tags/${tag.slug}`" class="group/tag inline-flex items-stretch overflow-hidden rounded border border-border text-xs shadow-elevated-sm outline-none transition-colors duration-150 hover:border-primary/40 focus-visible:ring-[3px] focus-visible:ring-ring/45 sm:text-sm">
                <!-- Name -->
                <span class="inline-flex items-center gap-1.5 bg-card px-3 py-1.5 font-medium text-foreground transition-colors duration-150 group-hover/tag:bg-primary/10 group-hover/tag:text-primary">
                    <span aria-hidden="true" class="text-primary">#</span>
                    {{ tag.name }}
                </span>

                <!-- Post count -->
                <span class="inline-flex items-center border-l border-border bg-surface px-2 text-[11px] font-semibold text-muted-foreground tabular-nums transition-colors duration-150 group-hover/tag:border-primary/40 group-hover/tag:bg-primary/10 group-hover/tag:text-primary">
                    {{ tag.count }}
                </span>
            </NuxtLinkLocale>
        </span>
    </div>
</template>
