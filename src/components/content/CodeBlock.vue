<script setup lang="ts">
import { CheckmarkCircle02Icon, Copy01Icon, CodeIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { codeToHtml } from 'shiki';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

type CodeLanguage = string;

// Props
const props = withDefaults(defineProps<{
    code?: string;
    language?: CodeLanguage;
    title?: string;
    copyable?: boolean;
}>(), {
    code: '',
    language: 'text',
    title: '',
    copyable: true
});

const { t } = useI18n();
const copied = ref(false);
const highlightedCode = ref('');
let highlightRequest = 0;
const resolvedTitle = computed(() => props.title || t('uiVintage.code.title'));
const displayedCode = computed(() => {
    if (props.language !== 'json') return props.code;

    try {
        return JSON.stringify(JSON.parse(props.code), null, 2);
    } catch {
        return props.code;
    }
});

// Highlight code in the library so all consumers share the same rendering behavior.
const highlightCode = async () => {
    const requestId = ++highlightRequest;
    highlightedCode.value = '';

    if (!displayedCode.value || props.language === 'text') return;

    try {
        const html = await codeToHtml(displayedCode.value, {
            lang: props.language,
            theme: 'github-dark'
        });

        if (requestId === highlightRequest) {
            highlightedCode.value = html;
        }
    } catch {
        // Keep the escaped plain-text fallback for unsupported languages.
    }
};

watch([displayedCode, () => props.language], highlightCode, { immediate: true });

// Copy the formatted code to the clipboard
const copyCode = async () => {
    if (!props.copyable || !displayedCode.value || !navigator.clipboard) {
        return;
    }

    await navigator.clipboard.writeText(displayedCode.value);
    copied.value = true;
    window.setTimeout(() => {
        copied.value = false;
    }, 1800);
};
</script>

<template>
    <div class="not-prose my-6 sm:my-8">
        <Card data-aos="blur-up" class="gap-0! sm:gap-0! overflow-hidden p-0! text-foreground">
            <!-- Code header -->
            <div class="flex items-center justify-between gap-3 border-b border-border bg-card px-3 py-2 sm:px-4">
                <div class="flex min-w-0 items-center gap-2">
                    <HugeiconsIcon :icon="CodeIcon" class="size-4 shrink-0 text-primary" />
                    <span class="truncate text-xs font-semibold text-muted-foreground">{{ resolvedTitle }}</span>
                </div>

                <!-- Copy code button -->
                <Button v-if="props.copyable"
                    variant="ghost"
                    size="icon"
                    class="size-7 text-muted-foreground hover:bg-accent hover:text-foreground"
                    :aria-label="t('uiVintage.code.copy')"
                    :title="t('uiVintage.code.copy')"
                    :disabled="!displayedCode"
                    @click="copyCode">
                    <HugeiconsIcon :icon="copied ? CheckmarkCircle02Icon : Copy01Icon" class="size-4" />
                </Button>
            </div>

            <!-- Code content -->
            <div v-if="highlightedCode" class="code-block-content overflow-x-auto bg-surface" v-html="highlightedCode" />
            <pre v-else class="code-block-content overflow-x-auto bg-surface px-4 py-3 text-xs leading-6 sm:px-5 sm:py-4 sm:text-sm"><code>{{ displayedCode }}</code></pre>
        </Card>
    </div>
</template>

<style scoped>
.code-block-content :deep(pre) {
    margin: 0;
    min-width: max-content;
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    line-height: 1.5rem;
}

@media (min-width: 640px) {
    .code-block-content :deep(pre) {
        padding: 1rem 1.25rem;
        font-size: 0.875rem;
    }
}
</style>