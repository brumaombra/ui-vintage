<script setup lang="ts">
import { CheckmarkCircle02Icon, Copy01Icon, CodeIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { codeToHtml } from 'shiki';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Button } from '../ui/button';

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
const languageLabels: Record<string, string> = {
    js: 'JavaScript',
    javascript: 'JavaScript',
    ts: 'TypeScript',
    typescript: 'TypeScript',
    vue: 'Vue',
    html: 'HTML',
    css: 'CSS',
    json: 'JSON',
    md: 'Markdown',
    markdown: 'Markdown',
    yaml: 'YAML',
    yml: 'YAML',
    text: 'Plain Text'
};
const languageLabel = computed(() => languageLabels[props.language] || props.language);
const displayedCode = computed(() => {
    if (props.language !== 'json') return props.code.replace(/\n$/, '');

    try {
        return JSON.stringify(JSON.parse(props.code), null, 2);
    } catch {
        return props.code.replace(/\n$/, '');
    }
});
const codeLines = computed(() => displayedCode.value.split(/\r?\n/));

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
        <div data-aos="blur-up" data-code-window class="overflow-hidden rounded border border-[#2b2b2b] bg-[#1f1f1f] text-[#cccccc] shadow-elevated-sm dark:border-border">
            <!-- Window title bar -->
            <div class="relative flex h-8 items-center border-b border-[#2b2b2b] bg-[#181818] px-3">
                <!-- Traffic lights -->
                <span aria-hidden="true" class="flex items-center gap-2">
                    <span class="size-3 rounded-full bg-[#ff5f57]" />
                    <span class="size-3 rounded-full bg-[#febc2e]" />
                    <span class="size-3 rounded-full bg-[#28c840]" />
                </span>

                <!-- Window title -->
                <div class="pointer-events-none absolute inset-x-24 truncate text-center text-xs text-[#9d9d9d]">{{ resolvedTitle }}</div>

                <!-- Copy code button -->
                <Button v-if="props.copyable"
                    variant="ghost"
                    size="icon"
                    class="ml-auto size-6 text-[#9d9d9d] hover:bg-white/10 hover:text-white"
                    :aria-label="t('uiVintage.code.copy')"
                    :title="t('uiVintage.code.copy')"
                    :disabled="!displayedCode"
                    @click="copyCode">
                    <HugeiconsIcon :icon="copied ? CheckmarkCircle02Icon : Copy01Icon" class="size-3.5" />
                </Button>
            </div>

            <!-- Editor tabs -->
            <div class="flex h-9 items-stretch border-b border-[#2b2b2b] bg-[#181818]">
                <!-- Active tab -->
                <div class="flex min-w-0 items-center gap-2 border-r border-[#2b2b2b] border-t-2 border-t-primary bg-[#1f1f1f] px-3 text-[#ffffff]">
                    <HugeiconsIcon :icon="CodeIcon" class="size-3.5 shrink-0 text-primary" />
                    <span class="truncate text-xs">{{ resolvedTitle }}</span>
                </div>
            </div>

            <!-- Code content -->
            <div v-if="highlightedCode" class="code-block-content overflow-x-auto" v-html="highlightedCode" />
            <div v-else class="code-block-content overflow-x-auto">
                <pre><code><template v-for="(line, index) in codeLines" :key="index"><span class="line">{{ line }}</span>{{ index < codeLines.length - 1 ? '\n' : '' }}</template></code></pre>
            </div>

            <!-- Status bar -->
            <div class="flex h-6 items-center justify-between gap-3 border-t border-[#2b2b2b] bg-[#181818] px-3 text-[11px] text-[#9d9d9d]">
                <span class="truncate">Ln {{ codeLines.length }}, Col 1</span>
                <span class="flex shrink-0 items-center gap-3">
                    <span>UTF-8</span>
                    <span>{{ languageLabel }}</span>
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.code-block-content :deep(pre) {
    margin: 0;
    min-width: max-content;
    padding: 0.75rem 1rem 0.75rem 0;
    background-color: transparent !important;
    color: #e1e4e8;
    font-size: 0.75rem;
    line-height: 1.5rem;
    counter-reset: line;
}

/* Line numbers in the editor gutter */
.code-block-content :deep(.line)::before {
    counter-increment: line;
    content: counter(line);
    display: inline-block;
    width: 2.75rem;
    margin-right: 1rem;
    padding-right: 0.25rem;
    text-align: right;
    color: #6e7681;
    user-select: none;
}

@media (min-width: 640px) {
    .code-block-content :deep(pre) {
        padding: 1rem 1.25rem 1rem 0;
        font-size: 0.875rem;
    }
}
</style>
