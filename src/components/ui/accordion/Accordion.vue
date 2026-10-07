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
const triggerId = useId();
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
    <Card :data-state="expanded ? 'open' : 'closed'" :class="cn('group/accordion gap-0! overflow-hidden p-0!', props.class)">
        <!-- Header -->
        <button :id="triggerId" type="button" :aria-expanded="expanded" :aria-controls="contentId" class="group/trigger flex w-full cursor-pointer items-center gap-3 px-5 py-3.5 text-left outline-none focus-visible:bg-surface focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/40" @click="toggleExpanded">
            <!-- Icon -->
            <span v-if="props.icon" class="flex size-7 shrink-0 items-center justify-center rounded border border-primary/30 text-primary">
                <HugeiconsIcon :icon="props.icon" :class="cn('size-3.5', props.iconClass)" />
            </span>

            <!-- Title -->
            <span class="min-w-0 flex-1 text-sm font-semibold text-foreground">
                {{ props.title }}
            </span>

            <!-- Optional content before the toggle icon -->
            <slot name="trailing" />

            <!-- Toggle icon -->
            <HugeiconsIcon :icon="ArrowDown01Icon" class="size-4 shrink-0 text-muted-foreground transition-[rotate,color] duration-[420ms] ease-spring group-hover/trigger:text-primary group-data-[state=open]/accordion:rotate-180 group-data-[state=open]/accordion:text-primary" />
        </button>

        <!-- Content -->
        <div :id="contentId" role="region" :aria-labelledby="triggerId" :aria-hidden="!expanded" :inert="!expanded || undefined" :class="['grid transition-[grid-template-rows,opacity] duration-[380ms] ease-out-expo', expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0']">
            <div class="overflow-hidden">
                <div :class="['border-t border-border px-5 py-4 transition-[translate,filter] duration-[420ms] ease-spring', expanded ? 'translate-y-0 blur-none' : '-translate-y-2 blur-[2px]']">
                    <slot />
                </div>
            </div>
        </div>
    </Card>
</template>
