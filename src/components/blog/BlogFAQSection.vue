<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { HelpCircleIcon } from '@hugeicons/core-free-icons';
import { Accordion } from '../ui/accordion';
import BlogSectionTitle from './BlogSectionTitle.vue';

// Props
const props = withDefaults(defineProps<{
    faqs?: Array<{
        question: string;
        answer: string;
    }>;
}>(), {
    faqs: () => []
});

const { t } = useI18n();
const hasValidFAQs = computed(() => props.faqs && props.faqs.length > 0);
</script>

<template>
    <div v-if="hasValidFAQs" class="mt-12 lg:mt-16">
        <!-- Title and description -->
        <BlogSectionTitle :title="t('uiVintage.blog.faq.title')" :description="t('uiVintage.blog.faq.description')" />

        <!-- FAQ items -->
        <div class="space-y-3">
            <div v-for="(faq, index) in props.faqs" :key="index" data-aos="blur-up" :data-aos-delay="index * 70">
                <Accordion :title="faq.question" :icon="HelpCircleIcon" :initially-expanded="index === 0">
                    <p class="text-xs leading-relaxed text-muted-foreground md:text-sm">
                        {{ faq.answer }}
                    </p>
                </Accordion>
            </div>
        </div>
    </div>
</template>