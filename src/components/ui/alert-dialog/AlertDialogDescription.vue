<script setup lang="ts">
import type { AlertDialogDescriptionProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { AlertDialogDescription } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<AlertDialogDescriptionProps & { class?: HTMLAttributes['class'] }>();

// Omit local class from delegated props
const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
    <AlertDialogDescription data-slot="alert-dialog-description" v-bind="delegatedProps" :class="cn('text-xs leading-6 text-muted-foreground sm:text-sm', props.class)">
        <slot />
    </AlertDialogDescription>
</template>