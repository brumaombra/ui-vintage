<script setup lang="ts">
import type { AlertDialogEmits, AlertDialogProps } from 'reka-ui';
import { AlertDialogRoot, useForwardPropsEmits } from 'reka-ui';

// Props
const props = defineProps<AlertDialogProps>();

// Emits
const emits = defineEmits<AlertDialogEmits>();

// Forward props and emits
const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
    <AlertDialogRoot v-slot="slotProps" data-slot="alert-dialog" v-bind="forwarded">
        <slot v-bind="slotProps" />
    </AlertDialogRoot>
</template>