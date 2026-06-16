<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card, CardContent } from '../ui/card';
import BlogSectionTitle from './BlogSectionTitle.vue';

// Props
const props = defineProps({
    faqs: { type: Array, default: () => [] }
});

const { t } = useI18n();
const expandedItems = ref({});
const hasValidFAQs = computed(() => props.faqs && props.faqs.length > 0);

// Toggle expanded state
const toggleItem = index => {
    expandedItems.value[index] = !expandedItems.value[index];
};

// Check if item is expanded
const isExpanded = index => {
    return expandedItems.value[index] || false;
};

// Auto-open first FAQ for better UX
if (hasValidFAQs.value) {
    expandedItems.value[0] = true;
}
</script>

<template>
    <div v-if="hasValidFAQs" class="mt-12 lg:mt-16">
        <!-- Title -->
        <BlogSectionTitle :title="t('uiVintage.blog.faq.title')" />

        <!-- Description -->
        <p class="text-base md:text-lg text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)] mb-8">
            {{ t('uiVintage.blog.faq.description') }}
        </p>

        <!-- FAQ Items -->
        <div class="space-y-4">
            <Card v-for="(faq, index) in props.faqs" :key="index" class="!p-0 cursor-pointer" @click="toggleItem(index)">
                <CardContent class="!p-0 gap-0">
                    <!-- Question -->
                    <div class="flex items-center justify-between p-5 gap-4">
                        <!-- Question text -->
                        <h3 class="text-sm md:!text-base font-semibold text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] text-left">
                            {{ faq.question }}
                        </h3>

                        <!-- Toggle icon -->
                        <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded bg-[var(--bg-card-light)] dark:bg-[var(--bg-card-dark)] border border-[var(--border-light)] dark:border-[var(--border-dark)] transition-transform duration-300" :class="{ 'rotate-180': isExpanded(index) }">
                            <HugeiconsIcon :icon="ArrowDown01Icon" class="size-4 text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]" />
                        </div>
                    </div>

                    <!-- Answer -->
                    <div class="overflow-hidden transition-all duration-300 ease-in-out" :class="isExpanded(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'">
                        <p class="px-5 pb-5 text-xs md:text-sm text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)] leading-relaxed">
                            {{ faq.answer }}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>