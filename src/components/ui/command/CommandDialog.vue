<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { useForwardPropsEmits } from 'reka-ui';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '../dialog';
import Command from './Command.vue';

// Props
const props = defineProps<DialogRootProps & {
    title?: string;
    description?: string;
    contentClass?: HTMLAttributes['class'];
}>();

const { t } = useI18n();
const resolvedTitle = computed(() => props.title || t('uiVintage.commandDialog.title'));
const resolvedDescription = computed(() => props.description || t('uiVintage.commandDialog.description'));

// Emits
const emits = defineEmits<DialogRootEmits>();

// Forward props
const delegatedProps = reactiveOmit(props, 'title', 'description', 'contentClass');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <Dialog v-slot="slotProps" v-bind="forwarded">
        <DialogContent :class="cn('top-[12vh] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl', props.contentClass)">
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