<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from 'reka-ui';
import { useForwardPropsEmits } from 'reka-ui';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../dialog';
import Command from './Command.vue';

// Props
const props = withDefaults(defineProps<DialogRootProps & {
    title?: string;
    description?: string;
}>(), {
    title: 'Command Palette',
    description: 'Search for a command to run...'
});

// Emits
const emits = defineEmits<DialogRootEmits>();

// Forward props
const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
    <Dialog v-slot="slotProps" v-bind="forwarded">
        <DialogContent class="overflow-hidden p-0">
            <DialogHeader class="sr-only">
                <DialogTitle>{{ title }}</DialogTitle>
                <DialogDescription>{{ description }}</DialogDescription>
            </DialogHeader>
            <Command>
                <slot v-bind="slotProps" />
            </Command>
        </DialogContent>
    </Dialog>
</template>