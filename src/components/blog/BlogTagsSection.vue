<script setup lang="ts">
import { Badge } from '../ui/badge';

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
        <NuxtLinkLocale v-for="(tag, index) in props.tags" :key="tag.slug" :to="`/blog/tags/${tag.slug}`" data-aos="fade-up" :data-aos-delay="Math.min(index * 100, 500)">
            <Badge color="gray" :text="`${tag.name} (${tag.count})`" class="transition-transform duration-200 ease-out hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100" />
        </NuxtLinkLocale>
    </div>
</template>