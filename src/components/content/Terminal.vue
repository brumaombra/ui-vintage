<script setup lang="ts">
import { CheckmarkCircle02Icon, Copy01Icon, TerminalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Button } from '../ui/button';

// Props
const props = withDefaults(defineProps<{
    commands?: string[];
    title?: string;
    prompt?: string;
    copyable?: boolean;
}>(), {
    commands: () => [],
    title: '',
    prompt: '$',
    copyable: true
});

const { t } = useI18n();
const copied = ref(false);
const commandText = computed(() => props.commands.join('\n'));
const resolvedTitle = computed(() => props.title || t('uiVintage.terminal.title'));

// Copy all command lines to the clipboard
const copyCommands = async () => {
    // Check if copy is enabled
    if (!props.copyable || !commandText.value || !navigator.clipboard) {
        return;
    }

    // Copy the command text to the clipboard
    await navigator.clipboard.writeText(commandText.value);
    copied.value = true;
    window.setTimeout(() => {
        copied.value = false;
    }, 1800);
};
</script>

<template>
    <div class="not-prose my-6 sm:my-8">
        <div data-aos="blur-up" data-terminal class="overflow-hidden rounded border border-[#2b2b2b] bg-[#1f1f1f] text-[#f2f2f2] shadow-elevated-sm dark:border-border">
            <!-- Window title bar -->
            <div class="relative flex h-8 items-center border-b border-[#2b2b2b] bg-[#181818] px-3">
                <!-- Traffic lights -->
                <span aria-hidden="true" class="flex items-center gap-2">
                    <span class="size-3 rounded-full bg-[#ff5f57]" />
                    <span class="size-3 rounded-full bg-[#febc2e]" />
                    <span class="size-3 rounded-full bg-[#28c840]" />
                </span>

                <!-- Window title -->
                <div class="pointer-events-none absolute inset-x-24 flex items-center justify-center gap-1.5 text-[#9d9d9d]">
                    <HugeiconsIcon :icon="TerminalIcon" class="size-3.5 shrink-0" />
                    <span class="truncate text-xs font-medium">{{ resolvedTitle }}</span>
                </div>

                <!-- Copy command button -->
                <Button v-if="props.copyable"
                    variant="ghost"
                    size="icon"
                    class="ml-auto size-6 text-[#9d9d9d] hover:bg-white/10 hover:text-white"
                    :aria-label="t('uiVintage.terminal.copy')"
                    :title="t('uiVintage.terminal.copy')"
                    :disabled="!commandText"
                    @click="copyCommands">
                    <HugeiconsIcon :icon="copied ? CheckmarkCircle02Icon : Copy01Icon" class="size-3.5" />
                </Button>
            </div>

            <!-- Terminal commands -->
            <pre class="overflow-x-auto px-4 py-3 text-xs leading-6 sm:px-5 sm:py-4 sm:text-sm"><code><span v-for="(command, index) in props.commands" :key="`${command}-${index}`" class="flex min-w-max"><span class="mr-2 select-none text-[#28c840]" aria-hidden="true">{{ props.prompt }}</span><span>{{ command }}</span><span v-if="index === props.commands.length - 1" class="terminal-cursor ml-1 inline-block w-[0.6em] bg-[#f2f2f2]/80" aria-hidden="true" /></span></code></pre>
        </div>
    </div>
</template>

<style scoped>
.terminal-cursor {
    animation: terminal-blink 1.1s steps(1) infinite;
}

@keyframes terminal-blink {
    50% {
        opacity: 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .terminal-cursor {
        animation: none;
    }
}
</style>
