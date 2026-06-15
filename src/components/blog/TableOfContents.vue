<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowDown01Icon, Bookmark01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card, CardContent } from '@/components/ui/card';

// Props
const props = defineProps({
    content: { type: Object, required: true }
});

const { t } = useI18n();
const isExpanded = ref(false);

// Create the headings list
const headings = computed(() => {
    const tocLinks = props.content?.body?.toc?.links || props.content?.toc?.links || [];

    // Recursive function to flatten the nested links
    const flattenLinks = links => {
        return links.flatMap(link => {
            // Extract the current heading
            const currentHeading = {
                id: link.id,
                text: link.text,
                level: link.depth
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
const scrollToHeading = id => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        });
    }
};

// Toggle expanded state
const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value;
};

// Get classes for heading button
const getHeadingButtonClasses = heading => {
    // Base classes for all titles
    const baseClasses = 'block w-full text-left px-0 py-2 md:px-3 md:py-3 rounded transition-all duration-200 hover:bg-[var(--bg-selected-light)] dark:hover:bg-[var(--bg-selected-dark)] cursor-pointer';

    // Add classes based on heading level
    let levelClasses = '';
    if (heading.level === 2) {
        levelClasses = 'text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] font-semibold text-xs md:text-sm';
    } else {
        levelClasses = 'text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)] !pl-6 text-xs md:text-sm';
    }

    // Return combined classes
    return [baseClasses, levelClasses];
};
</script>

<template>
    <Card v-if="headings.length > 0" class="!p-0 overflow-hidden">
        <CardContent class="!p-0 gap-0">
            <!-- Header -->
            <button @click="toggleExpanded" class="flex items-center justify-between w-full p-5 gap-4 text-left cursor-pointer">
                <div class="flex items-center gap-3 min-w-0">
                    <!-- Icon -->
                    <div class="flex items-center justify-center w-8 h-8 md:!w-10 md:!h-10 bg-[var(--bg-card-light)] dark:bg-[var(--bg-card-dark)] border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-none flex-shrink-0">
                        <HugeiconsIcon :icon="Bookmark01Icon" class="size-4 text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]" />
                    </div>

                    <!-- Title -->
                    <span class="text-sm md:!text-base font-semibold text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)]">
                        {{ t('blog.tableOfContents') }}
                    </span>
                </div>

                <!-- Expand/Collapse icon -->
                <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded bg-[var(--bg-card-light)] dark:bg-[var(--bg-card-dark)] border border-[var(--border-light)] dark:border-[var(--border-dark)] transition-transform duration-300" :class="{ 'rotate-180': isExpanded }">
                    <HugeiconsIcon :icon="ArrowDown01Icon" class="size-4 text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]" />
                </div>
            </button>

            <!-- Table of contents list with smooth transition -->
            <div class="overflow-hidden transition-all duration-300 ease-in-out" :class="isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'">
                <nav class="px-5 pb-5 space-y-1">
                    <button v-for="heading in headings" :key="heading.id" @click="scrollToHeading(heading.id)" :class="getHeadingButtonClasses(heading)">
                        {{ heading.text }}
                    </button>
                </nav>
            </div>
        </CardContent>
    </Card>
</template>