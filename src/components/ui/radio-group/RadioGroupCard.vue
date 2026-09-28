<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { RadioGroupIndicator, RadioGroupItem } from 'reka-ui';
import type { HugeiconsIconDefinition } from '../../../lib/common-types';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<{
    value: AcceptableValue;
    label: string;
    description?: string;
    icon?: HugeiconsIconDefinition;
    disabled?: boolean;
    id?: string;
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <RadioGroupItem :id="props.id" :value="props.value" :disabled="props.disabled" data-slot="radio-group-card" :class="cn(
        'group/radio-card relative flex w-full cursor-pointer items-center gap-3 rounded border border-border bg-card px-4 py-3 text-left shadow-elevated-sm outline-none',
        '[transition:scale_320ms_var(--ease-spring),border-color_150ms_var(--ease-snappy),background-color_150ms_var(--ease-snappy),box-shadow_200ms_var(--ease-snappy)]',
        'hover:border-border-strong active:scale-[0.985] focus-visible:ring-[3px] focus-visible:ring-ring/45',
        'data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 data-[state=checked]:shadow-glow data-[state=checked]:hover:border-primary',
        'disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100',
        props.class
    )">
        <!-- Icon -->
        <span v-if="props.icon" class="flex size-9 shrink-0 items-center justify-center rounded border border-border bg-surface text-muted-foreground transition-colors duration-150 group-data-[state=checked]/radio-card:border-primary/40 group-data-[state=checked]/radio-card:bg-primary/10 group-data-[state=checked]/radio-card:text-primary">
            <HugeiconsIcon :icon="props.icon" class="size-4.5" />
        </span>

        <!-- Label and description -->
        <span class="flex min-w-0 flex-1 flex-col gap-0.5">
            <span class="text-xs font-semibold text-foreground sm:text-sm">
                <slot name="label">{{ props.label }}</slot>
            </span>
            <span v-if="props.description || $slots.description" class="text-xs text-muted-foreground">
                <slot name="description">{{ props.description }}</slot>
            </span>
        </span>

        <!-- Radio circle -->
        <span aria-hidden="true" class="flex size-5 shrink-0 items-center justify-center rounded-full border border-input bg-secondary shadow-elevated-sm transition-colors duration-150 group-data-[state=checked]/radio-card:border-primary">
            <RadioGroupIndicator force-mount data-slot="radio-group-indicator" :class="cn(
                'pointer-events-none flex items-center justify-center opacity-0 scale-0',
                '[transition:scale_140ms_var(--ease-snappy),opacity_100ms_var(--ease-snappy)]',
                'data-[state=checked]:opacity-100 data-[state=checked]:scale-100 data-[state=checked]:[transition:scale_420ms_var(--ease-bounce),opacity_80ms_linear]'
            )">
                <span class="size-2.5 rounded-full bg-primary" />
            </RadioGroupIndicator>
        </span>
    </RadioGroupItem>
</template>