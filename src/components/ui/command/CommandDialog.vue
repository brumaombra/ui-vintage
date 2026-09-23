<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from 'reka-ui';
import { useForwardPropsEmits } from 'reka-ui';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '../dialog';
import Command from './Command.vue';

// Props
const props = defineProps<DialogRootProps & {
    title?: string;
    description?: string;
}>();

const { t } = useI18n();
const resolvedTitle = computed(() => props.title || t('uiVintage.commandDialog.title'));
const resolvedDescription = computed(() => props.description || t('uiVintage.commandDialog.description'));

// Emits
const emits = defineEmits<DialogRootEmits>();

// Forward props
const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
    <Dialog v-slot="slotProps" v-bind="forwarded">
        <DialogContent class="overflow-hidden p-0">
            <DialogHeader class="sr-only">
                <DialogTitle>{{ resolvedTitle }}</DialogTitle>
                <DialogDescription>{{ resolvedDescription }}</DialogDescription>
            </DialogHeader>
            <Command>
                <slot v-bind="slotProps" />
            </Command>
        </DialogContent>
    </Dialog>
</template>