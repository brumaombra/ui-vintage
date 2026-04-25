<script setup lang="ts">
import type { Component, PropType } from 'vue';

// Props
const props = defineProps({
    to: { type: String, required: true },
    text: { type: String, required: true },
    linkComponent: { type: [String, Object] as PropType<Component | string>, default: 'a' }
});

// Emits
const emits = defineEmits(['click']);

// Get link props based on the type of link component
const getLinkProps = () => {
    if (props.linkComponent === 'a') {
        return { href: props.to };
    } else {
        return { to: props.to };
    }
};

// Handle click
const handleClick = (event: MouseEvent) => {
    emits('click', event);
};
</script>

<template>
    <component :is="props.linkComponent" v-bind="getLinkProps()" class="cursor-pointer font-medium text-[var(--text-primary-light)] hover:underline dark:text-[var(--text-primary-dark)]" @click="handleClick">
        {{ props.text }}
    </component>
</template>