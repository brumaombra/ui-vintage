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
    <div class="not-prose my-6 sm:my-8">
        <Card data-aos="blur-up" class="gap-0! sm:gap-0! overflow-hidden p-0! text-foreground">
            <!-- Terminal header -->
            <div class="flex items-center justify-between gap-3 border-b border-border bg-card px-3 py-2 sm:px-4">
                <div class="flex min-w-0 items-center gap-2">
                    <!-- Window dots -->
                    <span aria-hidden="true" class="mr-1 flex items-center gap-1.5">
                        <span class="size-2.5 rounded-full bg-red-400/80" />
                        <span class="size-2.5 rounded-full bg-amber-400/80" />
                        <span class="size-2.5 rounded-full bg-green-400/80" />
                    </span>
                    <HugeiconsIcon :icon="TerminalIcon" class="size-4 shrink-0 text-muted-foreground" />
                    <span class="truncate text-xs font-semibold text-muted-foreground">{{ resolvedTitle }}</span>
                </div>

                <!-- Copy command button -->
                <Button v-if="props.copyable"
                    variant="ghost"
                    size="icon"
                    class="size-7 text-muted-foreground hover:bg-accent hover:text-foreground"
                    :aria-label="t('uiVintage.terminal.copy')"
                    :title="t('uiVintage.terminal.copy')"
                    :disabled="!commandText"
                    @click="copyCommands">
                    <HugeiconsIcon :icon="copied ? CheckmarkCircle02Icon : Copy01Icon" class="size-4" />
                </Button>
            </div>

            <!-- Terminal commands -->
            <pre class="overflow-x-auto bg-surface px-4 py-3 text-xs leading-6 sm:px-5 sm:py-4 sm:text-sm"><code><span v-for="(command, index) in props.commands" :key="`${command}-${index}`" class="flex min-w-max"><span class="mr-3 select-none text-primary" aria-hidden="true">{{ props.prompt }}</span><span>{{ command }}</span></span></code></pre>
        </Card>
    </div>
</template>