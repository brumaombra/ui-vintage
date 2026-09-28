<script setup lang="ts">
import type { NumberFieldRootEmits, NumberFieldRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { computed, nextTick, ref, watch } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { MinusSignIcon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput, NumberFieldRoot, useForwardPropsEmits } from 'reka-ui';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<NumberFieldRootProps & {
    placeholder?: string;
    decrementLabel?: string;
    incrementLabel?: string;
    class?: HTMLAttributes['class'];
    inputClass?: HTMLAttributes['class'];
}>();

// Emits
const emits = defineEmits<NumberFieldRootEmits>();

const delegatedProps = reactiveOmit(props, 'class', 'inputClass', 'placeholder', 'decrementLabel', 'incrementLabel');
const forwarded = useForwardPropsEmits(delegatedProps, emits);

const { t } = useI18n();
const resolvedDecrementLabel = computed(() => props.decrementLabel || t('uiVintage.numberField.decrement'));
const resolvedIncrementLabel = computed(() => props.incrementLabel || t('uiVintage.numberField.increment'));

const viewportRef = ref<HTMLElement | null>(null);
const ghostRef = ref<HTMLElement | null>(null);
const ghostText = ref('');
const lastValue = ref<number | null | undefined>(props.modelValue ?? props.defaultValue);
let ghostAnimation: Animation | null = null;

// Keep the reference value in sync with external model updates
watch(() => props.modelValue, (value) => {
    lastValue.value = value;
});

// Slide the new digits in (and the old ones out) in the direction of the change
const animateChange = async (value: number) => {
    const previous = lastValue.value;
    lastValue.value = value;

    const input = viewportRef.value?.querySelector('input');
    if (!input || typeof window === 'undefined' || previous === null || previous === undefined || Number.isNaN(previous) || Number.isNaN(value)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // The DOM still shows the previous text at this point
    const previousText = input.value;
    const direction = value > previous ? 1 : -1;
    ghostAnimation?.cancel();
    ghostText.value = previousText;
    await nextTick();

    // Skip when the text did not visibly change (e.g. a typed value committed on blur)
    if (input.value === previousText) {
        ghostText.value = '';
        return;
    }

    const options: KeyframeAnimationOptions = { duration: 320, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' };
    input.animate([
        { transform: `translateY(${direction * 60}%)`, opacity: 0, filter: 'blur(2px)' },
        { transform: 'translateY(0)', opacity: 1, filter: 'blur(0)' }
    ], options);

    if (ghostRef.value) {
        ghostAnimation = ghostRef.value.animate([
            { transform: 'translateY(0)', opacity: 1, filter: 'blur(0)' },
            { transform: `translateY(${direction * -60}%)`, opacity: 0, filter: 'blur(2px)' }
        ], { ...options, duration: 220, fill: 'forwards' });
        ghostAnimation.onfinish = () => {
            ghostText.value = '';
        };
    }
};
</script>

<template>
    <NumberFieldRoot v-slot="slotProps" data-slot="number-field" v-bind="forwarded" :class="cn(
        'uv-field flex h-13 w-full items-center gap-1 rounded border border-input bg-secondary px-1.5 text-foreground shadow-elevated-sm',
        'data-disabled:cursor-not-allowed data-disabled:opacity-60 aria-invalid:animate-uv-shake',
        props.class
    )" @update:model-value="animateChange">
        <!-- Decrement button -->
        <NumberFieldDecrement data-slot="number-field-decrement" :aria-label="resolvedDecrementLabel" :class="cn(
            'inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground outline-none',
            '[transition:scale_320ms_var(--ease-spring),background-color_150ms_var(--ease-snappy),color_150ms_var(--ease-snappy),opacity_150ms_var(--ease-snappy)]',
            'hover:bg-accent hover:text-foreground active:scale-[0.84] data-pressed:scale-[0.84] focus-visible:ring-[3px] focus-visible:ring-ring/45',
            'disabled:pointer-events-none disabled:opacity-35 data-disabled:pointer-events-none data-disabled:opacity-35'
        )">
            <slot name="decrement-icon">
                <HugeiconsIcon :icon="MinusSignIcon" class="size-4" />
            </slot>
        </NumberFieldDecrement>

        <!-- Value viewport (clips the sliding digits) -->
        <div ref="viewportRef" class="relative flex h-full min-w-0 flex-1 items-center overflow-hidden">
            <NumberFieldInput data-slot="number-field-input" :placeholder="props.placeholder" :class="cn(
                'h-full w-full min-w-0 bg-transparent text-center text-xs font-semibold tabular-nums text-foreground outline-none sm:text-sm',
                'selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground placeholder:opacity-60 disabled:cursor-not-allowed',
                props.inputClass
            )" />

            <!-- Outgoing value ghost (decorative) -->
            <span v-if="ghostText" ref="ghostRef" aria-hidden="true" :class="cn(
                'pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums text-foreground sm:text-sm',
                props.inputClass
            )">{{ ghostText }}</span>
        </div>

        <!-- Increment button -->
        <NumberFieldIncrement data-slot="number-field-increment" :aria-label="resolvedIncrementLabel" :class="cn(
            'inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground outline-none',
            '[transition:scale_320ms_var(--ease-spring),background-color_150ms_var(--ease-snappy),color_150ms_var(--ease-snappy),opacity_150ms_var(--ease-snappy)]',
            'hover:bg-accent hover:text-foreground active:scale-[0.84] data-pressed:scale-[0.84] focus-visible:ring-[3px] focus-visible:ring-ring/45',
            'disabled:pointer-events-none disabled:opacity-35 data-disabled:pointer-events-none data-disabled:opacity-35'
        )">
            <slot name="increment-icon">
                <HugeiconsIcon :icon="PlusSignIcon" class="size-4" />
            </slot>
        </NumberFieldIncrement>

        <!-- Extra content (e.g. hidden inputs) -->
        <slot v-bind="slotProps" />
    </NumberFieldRoot>
</template>