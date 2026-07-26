<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Bookmark01Icon } from '@hugeicons/core-free-icons';
import { Accordion } from '../ui/accordion';

interface BlogTocLink {
    id?: string;
    text?: string;
    depth?: number;
    children?: BlogTocLink[];
}

// Props
const props = defineProps<{
    content: {
        body?: {
            toc?: {
                links?: BlogTocLink[];
            };
        };
        toc?: {
            links?: BlogTocLink[];
        };
    };
}>();

const { t } = useI18n();

// Create the headings list
const headings = computed(() => {
    const tocLinks = props.content?.body?.toc?.links || props.content?.toc?.links || [];

    // Recursive function to flatten the nested links
    const flattenLinks = (links: BlogTocLink[]): Array<{ id: string; text: string; level: number }> => {
        return links.flatMap(link => {
            // Extract the current heading
            const currentHeading = {
                id: link.id ?? '',
                text: link.text ?? '',
                level: link.depth ?? 0
            };

            // Recursively flatten the children links
            const children = link.children?.length ? flattenLinks(link.children) : [];
            return [currentHeading, ...children];
        });
    };

    // Return the flattened list of headings
    return flattenLinks(tocLinks).filter(heading => heading.id && heading.text && heading.level >= 2 && heading.level <= 3);
});

// Smooth scroll to heading
const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        });
    }
};

// Get classes for heading button
const getHeadingButtonClasses = (level: number) => {
    // Base classes for all titles
    const baseClasses = 'block w-full text-left px-0 py-2 md:px-3 md:py-2 rounded transition-all duration-200 hover:bg-(--bg-selected-light) dark:hover:bg-(--bg-selected-dark) cursor-pointer';

    // Add classes based on heading level
    let levelClasses = '';
    if (level === 2) {
        levelClasses = 'text-(--text-primary-light) dark:text-(--text-primary-dark) font-semibold text-xs md:text-sm';
    } else {
        levelClasses = 'text-(--text-secondary-light) dark:text-(--text-secondary-dark) pl-6! text-xs md:text-sm';
    }

    // Return combined classes
    return [baseClasses, levelClasses];
};
</script>

<template>
    <Accordion v-if="headings.length > 0" :title="t('uiVintage.blog.tableOfContents')" :icon="Bookmark01Icon">
        <nav class="space-y-1">
            <button v-for="heading in headings" :key="heading.id" @click="scrollToHeading(heading.id)" :class="getHeadingButtonClasses(heading.level)">
                {{ heading.text }}
            </button>
        </nav>
    </Accordion>
</template>