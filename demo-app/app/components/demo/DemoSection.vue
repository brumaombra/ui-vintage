<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { CodeIcon, Link01Icon, ViewIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Badge } from '@brumaombra/ui-vintage/badge';
import { Card } from '@brumaombra/ui-vintage/card';
import { CodeBlock } from '@brumaombra/ui-vintage/content';
import { ToggleGroup, ToggleGroupItem } from '@brumaombra/ui-vintage/toggle-group';

// Props
const props = withDefaults(defineProps<{
    id: string;
    title: string;
    description?: string;
    badge?: 'New' | 'Updated' | '';
    code?: string;
    language?: string;
    previewClass?: string;
}>(), {
    description: '',
    badge: '',
    code: '',
    language: 'vue',
    previewClass: ''
});

const view = ref<'preview' | 'code'>('preview');
const sectionRef = ref<HTMLElement | null>(null);
const revealed = ref(false);
let observer: IntersectionObserver | null = null;

// Keep one option selected in the segmented control
const handleViewChange = (value: unknown) => {
    if (value === 'preview' || value === 'code') view.value = value;
};

// Reveal the section the first time it scrolls into view
onMounted(() => {
    if (!sectionRef.value || typeof IntersectionObserver === 'undefined') {
        revealed.value = true;
        return;
    }
    observer = new IntersectionObserver((entries) => {
        if (entries.some(entry => entry.isIntersecting)) {
            revealed.value = true;
            observer?.disconnect();
        }
    }, { rootMargin: '0px 0px -8% 0px' });
    observer.observe(sectionRef.value);
});

// Stop observing on unmount
onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
    <section :id="props.id" ref="sectionRef" :class="['scroll-mt-24 transition-[opacity,translate,filter] duration-700 ease-out-expo', revealed ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-4 opacity-0 blur-[3px]']">
        <!-- Section header -->
        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div class="min-w-0">
                <div class="flex items-center gap-2">
                    <!-- Title with anchor link -->
                    <h2 class="group/anchor flex items-center gap-2 text-base font-bold tracking-tight sm:text-lg">
                        {{ props.title }}
                        <a :href="`#${props.id}`" class="text-muted-foreground opacity-0 transition-opacity duration-150 group-hover/anchor:opacity-100 hover:text-primary" :aria-label="`Link to ${props.title}`">
                            <HugeiconsIcon :icon="Link01Icon" class="size-4" />
                        </a>
                    </h2>

                    <!-- Status badge -->
                    <Badge v-if="props.badge" :text="props.badge" :color="props.badge === 'New' ? 'yellow' : 'blue'" :pulse="props.badge === 'New'" />
                </div>

                <!-- Description -->
                <p v-if="props.description" class="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm">
                    {{ props.description }}
                </p>
            </div>

            <!-- Preview / code switch -->
            <ToggleGroup v-if="props.code" :model-value="view" type="single" size="sm" class="self-start sm:self-auto" @update:model-value="handleViewChange">
                <ToggleGroupItem value="preview">
                    <HugeiconsIcon :icon="ViewIcon" class="size-4" />
                    Preview
                </ToggleGroupItem>
                <ToggleGroupItem value="code">
                    <HugeiconsIcon :icon="CodeIcon" class="size-4" />
                    Code
                </ToggleGroupItem>
            </ToggleGroup>
        </div>

        <!-- Preview / code body -->
        <Transition mode="out-in" enter-active-class="transition-[opacity,translate] duration-300 ease-out-expo" enter-from-class="opacity-0 translate-y-1" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
            <Card v-if="view === 'preview'" key="preview" class="relative gap-0! overflow-hidden p-0! sm:gap-0!">
                <!-- Dotted canvas -->
                <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,color-mix(in_oklab,var(--foreground)_9%,transparent)_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_at_center,black_40%,transparent_85%)]" />
                <div :class="['relative p-5 sm:p-8', props.previewClass]">
                    <slot />
                </div>
            </Card>
            <CodeBlock v-else key="code" :code="props.code" :language="props.language" :title="`${props.title}.vue`" />
        </Transition>
    </section>
</template>