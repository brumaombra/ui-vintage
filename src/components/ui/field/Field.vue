<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { FieldVariants } from '.';
import { cn } from '../../../lib/utils';
import { fieldVariants } from '.';
import { provideFieldContext } from './field-context';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
    orientation?: FieldVariants['orientation'];
}>();

// Let FieldLabel point to the control placed in this field
provideFieldContext();
</script>

<template>
    <div role="group" data-slot="field" :data-orientation="orientation" :class="cn(fieldVariants({ orientation }), props.class)">
        <slot />
    </div>
</template>