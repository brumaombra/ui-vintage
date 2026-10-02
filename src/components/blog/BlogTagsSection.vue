<script setup lang="ts">
// Props
const props = withDefaults(defineProps<{
    tags?: Array<{
        name: string;
        slug: string;
        count: number;
    }>;
}>(), {
    tags: () => []
});
</script>

<template>
    <div v-if="props.tags.length" class="flex flex-wrap gap-3">
        <!-- Tag chip -->
        <span v-for="(tag, index) in props.tags" :key="tag.slug" data-aos="blur-up" :data-aos-delay="Math.min(index * 40, 400)" class="inline-flex">
            <NuxtLinkLocale :to="`/blog/tags/${tag.slug}`" class="group/tag inline-flex items-center gap-2 rounded border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-elevated-sm outline-none [transition:translate_300ms_var(--ease-spring),border-color_150ms,color_150ms,box-shadow_200ms] hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary hover:shadow-elevated-md focus-visible:ring-[3px] focus-visible:ring-ring/45 sm:text-sm">
                <span aria-hidden="true" class="text-primary transition-[rotate] duration-300 ease-bounce group-hover/tag:rotate-12">#</span>
                {{ tag.name }}
                <span class="rounded-sm bg-surface px-1.5 py-0.5 text-[11px] text-muted-foreground tabular-nums transition-colors duration-150 group-hover/tag:bg-primary/10 group-hover/tag:text-primary">{{ tag.count }}</span>
            </NuxtLinkLocale>
        </span>
    </div>
</template>