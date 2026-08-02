<script setup lang="ts">
import { CheckmarkCircle02Icon, Copy01Icon, TerminalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

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
    <div class="not-prose my-6 sm:my-12">
        <Card class="gap-0! sm:gap-0! overflow-hidden p-0! text-(--text-primary-light) dark:text-(--text-primary-dark)">
            <!-- Terminal header -->
            <div class="flex items-center justify-between gap-3 border-b border-(--border-light) bg-(--bg-card-light) px-3 py-2 sm:px-4 dark:border-(--border-dark) dark:bg-(--bg-card-dark)">
                <div class="flex min-w-0 items-center gap-2">
                    <HugeiconsIcon :icon="TerminalIcon" class="size-4 shrink-0 text-(--text-secondary-light) dark:text-(--text-secondary-dark)" />
                    <span class="truncate text-xs font-semibold text-(--text-secondary-light) dark:text-(--text-secondary-dark)">{{ resolvedTitle }}</span>
                </div>

                <!-- Copy command button -->
                <Button v-if="props.copyable"
                    variant="ghost"
                    size="icon"
                    class="size-7 text-(--text-secondary-light) hover:bg-(--bg-selected-light) hover:text-(--text-primary-light) dark:text-(--text-secondary-dark) dark:hover:bg-(--bg-selected-dark) dark:hover:text-(--text-primary-dark)"
                    :aria-label="t('uiVintage.terminal.copy')"
                    :title="t('uiVintage.terminal.copy')"
                    :disabled="!commandText"
                    @click="copyCommands">
                    <HugeiconsIcon :icon="copied ? CheckmarkCircle02Icon : Copy01Icon" class="size-4" />
                </Button>
            </div>

            <!-- Terminal commands -->
            <pre class="overflow-x-auto bg-(--bg-surface-light) px-4 py-3 text-xs leading-6 dark:bg-(--bg-surface-dark) sm:px-5 sm:py-4 sm:text-sm"><code><span v-for="(command, index) in props.commands" :key="`${command}-${index}`" class="flex min-w-max"><span class="mr-3 select-none text-(--text-secondary-light) dark:text-(--text-secondary-dark)" aria-hidden="true">{{ props.prompt }}</span><span>{{ command }}</span></span></code></pre>
        </Card>
    </div>
</template>