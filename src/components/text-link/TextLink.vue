<script setup lang="ts">
import type { Component } from 'vue';

// Props
const props = withDefaults(defineProps<{
    to: string;
    text: string;
    linkComponent?: Component | string;
}>(), {
    linkComponent: 'a'
});

// Emits
const emits = defineEmits<{
    click: [event: MouseEvent];
}>();

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
    <component :is="props.linkComponent" v-bind="getLinkProps()" class="cursor-pointer font-semibold text-(--text-primary-light) hover:underline dark:text-(--text-primary-dark)" @click="handleClick">
        {{ props.text }}
    </component>
</template>