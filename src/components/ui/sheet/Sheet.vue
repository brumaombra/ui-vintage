<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from 'reka-ui';
import { DialogRoot, useForwardPropsEmits } from 'reka-ui';

// Props
const props = defineProps<DialogRootProps>();

// Emits
const emits = defineEmits<DialogRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
    <DialogRoot v-slot="slotProps" data-slot="sheet" v-bind="forwarded">
        <slot v-bind="slotProps" />
    </DialogRoot>
</template>