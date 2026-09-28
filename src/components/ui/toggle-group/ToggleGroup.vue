<script setup lang="ts">
import type { ToggleGroupRootEmits, ToggleGroupRootProps } from 'reka-ui';
import type { CSSProperties, HTMLAttributes } from 'vue';
import type { ToggleGroupSize } from '.';
import { reactiveOmit, unrefElement, useMutationObserver, useResizeObserver } from '@vueuse/core';
import { ToggleGroupRoot, useForwardPropsEmits } from 'reka-ui';
import { computed, nextTick, onMounted, provide, ref, shallowRef, toRef } from 'vue';
import { cn } from '../../../lib/utils';
import { toggleGroupContextKey } from '.';

// Props
const props = withDefaults(defineProps<ToggleGroupRootProps & {
    size?: ToggleGroupSize;
    highlight?: boolean;
    class?: HTMLAttributes['class'];
}>(), {
    size: 'default',
    highlight: false,
    disabled: false,
    rovingFocus: true,
    loop: true,
});

// Emits
const emits = defineEmits<ToggleGroupRootEmits>();

const delegatedProps = reactiveOmit(props, 'class', 'size', 'highlight');
const forwarded = useForwardPropsEmits(delegatedProps, emits);

// Single selection gets the sliding indicator (mirrors reka's type inference)
const isSingle = computed(() => {
    if (props.type) return props.type === 'single';
    return !Array.isArray(props.modelValue ?? props.defaultValue);
});

// Share size and indicator mode with the items
provide(toggleGroupContextKey, { size: toRef(props, 'size'), indicator: isSingle });

// Sliding indicator geometry
const rootRef = ref();
const activeItem = shallowRef<HTMLElement | null>(null);
const rect = ref({ x: 0, y: 0, width: 0, height: 0 });
const visible = ref(false);
const animated = ref(false);

// Measure the active item (offset* ignores the press scale transform)
function measure() {
    const root = unrefElement(rootRef) as HTMLElement | null | undefined;
    if (!root || !isSingle.value) return;
    const item = root.querySelector<HTMLElement>('[data-slot="toggle-group-item"][data-state="on"]');
    activeItem.value = item;
    if (!item) {
        visible.value = false;
        return;
    }
    rect.value = { x: item.offsetLeft, y: item.offsetTop, width: item.offsetWidth, height: item.offsetHeight };
    visible.value = true;
}

// Re-measure when selection changes or when the layout moves
useMutationObserver(rootRef, measure, { subtree: true, attributes: true, attributeFilter: ['data-state'] });
useResizeObserver(rootRef, measure);
useResizeObserver(activeItem, measure);

// First placement is instant, later moves slide
onMounted(async () => {
    measure();
    await nextTick();
    requestAnimationFrame(() => {
        animated.value = true;
    });
});

const indicatorStyle = computed<CSSProperties>(() => ({
    width: `${rect.value.width}px`,
    height: `${rect.value.height}px`,
    transform: `translate(${rect.value.x}px, ${rect.value.y}px) scale(${visible.value ? 1 : 0.9})`,
    opacity: visible.value ? 1 : 0,
}));
</script>

<template>
    <ToggleGroupRoot ref="rootRef" v-slot="slotProps" data-slot="toggle-group" :data-size="props.size" v-bind="forwarded" :class="cn('relative inline-flex w-fit items-center gap-1 rounded border border-border bg-card p-1 shadow-elevated-sm data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch', props.class)">
        <!-- Sliding indicator behind the active item -->
        <span v-if="isSingle" data-slot="toggle-group-indicator" aria-hidden="true" :style="indicatorStyle" :class="cn(
            'pointer-events-none absolute top-0 left-0 z-0 rounded-sm border',
            animated && '[transition:transform_380ms_var(--ease-spring),width_380ms_var(--ease-spring),height_380ms_var(--ease-spring),opacity_180ms_var(--ease-snappy)]',
            props.highlight ? 'border-primary/40 bg-primary/10 shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_10%,transparent)]' : 'border-border-strong bg-surface shadow-elevated-sm'
        )" />

        <slot v-bind="slotProps" />
    </ToggleGroupRoot>
</template>