<script setup lang="ts">
import type { RadioGroupItemEmits, RadioGroupItemProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { RadioGroupIndicator, RadioGroupItem, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<RadioGroupItemProps & {
    class?: HTMLAttributes['class'];
}>();

// Emits
const emits = defineEmits<RadioGroupItemEmits>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <RadioGroupItem v-slot="slotProps" data-slot="radio-group-item" v-bind="forwarded" :class="cn(
        'peer relative inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full border border-input bg-secondary text-primary shadow-elevated-sm outline-none',
        '[transition:scale_320ms_var(--ease-spring),border-color_150ms_var(--ease-snappy),box-shadow_150ms_var(--ease-snappy)]',
        'hover:border-border-strong active:scale-[0.86] focus-visible:ring-[3px] focus-visible:ring-ring/45',
        'data-[state=checked]:border-primary data-[state=checked]:hover:border-primary',
        'disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 aria-invalid:border-destructive',
        props.class
    )">
        <!-- Indicator (always mounted so the dot can pop in and shrink out) -->
        <RadioGroupIndicator force-mount data-slot="radio-group-indicator" :class="cn(
            'pointer-events-none flex items-center justify-center opacity-0 scale-0',
            '[transition:scale_140ms_var(--ease-snappy),opacity_100ms_var(--ease-snappy)]',
            'data-[state=checked]:opacity-100 data-[state=checked]:scale-100 data-[state=checked]:[transition:scale_420ms_var(--ease-bounce),opacity_80ms_linear]'
        )">
            <slot v-bind="slotProps">
                <span class="size-2.5 rounded-full bg-primary" />
            </slot>
        </RadioGroupIndicator>
    </RadioGroupItem>
</template>