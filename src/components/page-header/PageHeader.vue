<script setup lang="ts">
import { Comment, Text, computed, useSlots, type VNode } from 'vue';

// Props
const props = defineProps({
    title: { type: String, required: true },
    headingLevel: { type: Number, default: 1 },
    size: { type: String, default: 'large', validator: (value: unknown) => ['small', 'medium', 'large'].includes(String(value)) }
});

const slots = useSlots();

// Check if there is content in the default slot
const hasSlotContent = computed(() => {
    if (!slots.default) return false;

    // Check if the slot has any non-empty content
    return slots.default({}).some((vnode: VNode) => {
        if (vnode.type === Comment) return false;
        if (vnode.type === Text && typeof vnode.children === 'string' && !vnode.children.trim()) return false;
        return true;
    });
});

// Get size classes based on size prop
const getSizeClasses = (size: string) => {
    const baseClasses = 'font-bold text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)]';

    // Return classes based on size
    switch (size) {
        case 'small':
            return `${baseClasses} text-base md:text-xl`;
        case 'medium':
            return `${baseClasses} text-lg md:text-2xl`;
        case 'large':
        default:
            return `${baseClasses} text-xl md:text-3xl`;
    }
};
</script>

<template>
    <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:justify-between sm:items-center sm:min-h-12 sm:gap-0">
        <!-- Title -->
        <component :is="`h${headingLevel}`" :class="getSizeClasses(props.size)">{{ props.title }}</component>

        <!-- Right section -->
        <div v-if="hasSlotContent" class="w-full sm:w-auto">
            <slot />
        </div>
    </div>
</template>