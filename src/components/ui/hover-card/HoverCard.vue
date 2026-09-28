<script setup lang="ts">
import type { HoverCardRootEmits, HoverCardRootProps } from 'reka-ui';
import { HoverCardRoot, useForwardPropsEmits } from 'reka-ui';

// Props
const props = withDefaults(defineProps<HoverCardRootProps>(), {
    openDelay: 350,
    closeDelay: 150
});

// Emits
const emits = defineEmits<HoverCardRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
    <HoverCardRoot v-slot="slotProps" data-slot="hover-card" v-bind="forwarded">
        <slot v-bind="slotProps" />
    </HoverCardRoot>
</template>