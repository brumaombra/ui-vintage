<script setup lang="ts">
import type { CheckboxRootEmits, CheckboxRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { CheckboxIndicator, CheckboxRoot, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';
import { useFieldControlId } from '../field/field-context';

// Props
const props = defineProps<CheckboxRootProps & {
    class?: HTMLAttributes['class'];
}>();

// Emits
const emits = defineEmits<CheckboxRootEmits>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);

// Let a surrounding Field label point to this control
const fieldControlId = useFieldControlId(() => props.id);
</script>

<template>
    <CheckboxRoot v-slot="slotProps" data-slot="checkbox" v-bind="forwarded" :id="fieldControlId" :class="cn(
        'group/checkbox peer relative inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-input bg-secondary text-primary-foreground shadow-elevated-sm outline-none',
        '[transition:scale_320ms_var(--ease-spring),background-color_150ms_var(--ease-snappy),border-color_150ms_var(--ease-snappy),box-shadow_150ms_var(--ease-snappy)]',
        'hover:border-border-strong active:scale-[0.86] focus-visible:ring-[3px] focus-visible:ring-ring/45',
        'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary',
        'disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 aria-invalid:border-destructive',
        props.class
    )">
        <!-- Indicator (always mounted so the mark can draw in and out) -->
        <CheckboxIndicator force-mount data-slot="checkbox-indicator" class="pointer-events-none flex size-full items-center justify-center">
            <slot v-bind="slotProps">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="size-3.5" aria-hidden="true">
                    <!-- Check mark: draws itself via stroke-dashoffset -->
                    <path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1" :class="cn(
                        'opacity-0 [stroke-dasharray:1_2] [stroke-dashoffset:1] [transition:stroke-dashoffset_120ms_var(--ease-snappy),opacity_90ms_var(--ease-snappy)_30ms]',
                        'group-data-[state=checked]/checkbox:opacity-100 group-data-[state=checked]/checkbox:[stroke-dashoffset:0] group-data-[state=checked]/checkbox:[transition:stroke-dashoffset_380ms_var(--ease-out-expo)_40ms,opacity_60ms_linear_40ms]'
                    )" />

                    <!-- Indeterminate dash: sweeps in from the left -->
                    <path d="M6.5 12h11" pathLength="1" :class="cn(
                        'opacity-0 [stroke-dasharray:1_2] [stroke-dashoffset:1] [transition:stroke-dashoffset_120ms_var(--ease-snappy),opacity_90ms_var(--ease-snappy)_30ms]',
                        'group-data-[state=indeterminate]/checkbox:opacity-100 group-data-[state=indeterminate]/checkbox:[stroke-dashoffset:0] group-data-[state=indeterminate]/checkbox:[transition:stroke-dashoffset_320ms_var(--ease-out-expo)_40ms,opacity_60ms_linear_40ms]'
                    )" />
                </svg>
            </slot>
        </CheckboxIndicator>
    </CheckboxRoot>
</template>