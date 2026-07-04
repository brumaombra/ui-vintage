<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Accordion } from '@brumaombra/ui-vintage/accordion';
import BlogSectionTitle from './BlogSectionTitle.vue';

// Props
const props = defineProps({
    faqs: { type: Array, default: () => [] }
});

const { t } = useI18n();
const hasValidFAQs = computed(() => props.faqs && props.faqs.length > 0);
</script>

<template>
    <div v-if="hasValidFAQs" class="mt-12 lg:mt-16">
        <!-- Title -->
        <BlogSectionTitle :title="t('uiVintage.blog.faq.title')" />

        <!-- Description -->
        <p class="text-base md:text-lg text-(--text-secondary-light) dark:text-(--text-secondary-dark) mb-8">
            {{ t('uiVintage.blog.faq.description') }}
        </p>

        <!-- FAQ Items -->
        <div class="space-y-4">
            <Accordion v-for="(faq, index) in props.faqs" :key="index" :title="faq.question" :initially-expanded="index === 0">
                <p class="text-xs md:text-sm text-(--text-secondary-light) dark:text-(--text-secondary-dark) leading-relaxed">
                    {{ faq.answer }}
                </p>
            </Accordion>
        </div>
    </div>
</template>