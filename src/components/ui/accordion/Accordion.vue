<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed, ref, useId } from 'vue';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card } from '../card';
import { cn } from '../../../lib/utils';
import type { HugeiconsIconDefinition } from '../../../lib/common-types';

// Props
const props = withDefaults(defineProps<{
    title: string;
    initiallyExpanded?: boolean;
    open?: boolean;
    icon?: HugeiconsIconDefinition | null;
    iconClass?: HTMLAttributes['class'];
    class?: HTMLAttributes['class'];
}>(), {
    initiallyExpanded: false,
    open: undefined
});

// Emits
const emits = defineEmits<{
    'update:open': [value: boolean];
}>();

const contentId = useId();
const internalExpanded = ref(props.initiallyExpanded);

// Support both controlled (v-model:open) and uncontrolled usage
const expanded = computed(() => props.open ?? internalExpanded.value);

// Toggle expanded state
const toggleExpanded = () => {
    const nextValue = !expanded.value;
    internalExpanded.value = nextValue;
    emits('update:open', nextValue);
};
</script>

<template>
    <Card :data-state="expanded ? 'open' : 'closed'" :class="cn('group/accordion gap-0! overflow-hidden sm:gap-0! p-0! data-[state=open]:border-primary/25', props.class)">
        <!-- Header -->
        <button type="button" :aria-expanded="expanded" :aria-controls="contentId" class="group/trigger flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left outline-none focus-visible:bg-surface focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/40" @click="toggleExpanded">
            <div class="flex min-w-0 items-center gap-3">
                <!-- Icon -->
                <div v-if="props.icon" class="flex size-8 shrink-0 items-center justify-center rounded border border-border bg-card transition-[border-color,color] duration-200 group-hover/trigger:border-primary/60 group-data-[state=open]/accordion:border-primary/60 md:size-10">
                    <HugeiconsIcon :icon="props.icon" :class="cn('size-4 text-muted-foreground transition-colors duration-200 group-hover/trigger:text-primary group-data-[state=open]/accordion:text-primary', props.iconClass)" />
                </div>

                <!-- Title -->
                <div class="text-left text-sm font-semibold text-foreground md:text-base!">
                    {{ props.title }}
                </div>
            </div>

            <!-- Toggle icon -->
            <div class="flex size-8 shrink-0 items-center justify-center rounded border border-border bg-card transition-[rotate,border-color,background-color] duration-[420ms] ease-spring group-hover/trigger:border-primary/50 group-data-[state=open]/accordion:rotate-180 group-data-[state=open]/accordion:border-primary/50 group-data-[state=open]/accordion:bg-primary/10">
                <HugeiconsIcon :icon="ArrowDown01Icon" class="size-4 text-muted-foreground transition-colors duration-200 group-hover/trigger:text-primary group-data-[state=open]/accordion:text-primary" />
            </div>
        </button>

        <!-- Content -->
        <div :id="contentId" role="region" :aria-hidden="!expanded" :inert="!expanded || undefined" :class="['grid transition-[grid-template-rows,opacity] duration-[380ms] ease-out-expo', expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0']">
            <div class="overflow-hidden">
                <div :class="['px-5 pb-5 transition-[translate,filter] duration-[420ms] ease-spring', expanded ? 'translate-y-0 blur-0' : '-translate-y-2 blur-[2px]']">
                    <slot />
                </div>
            </div>
        </div>
    </Card>
</template>