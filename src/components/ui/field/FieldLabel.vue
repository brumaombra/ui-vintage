<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';
import { Label } from '../label';
import { useFieldLabel } from './field-context';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();

// Point to the control of the surrounding Field (an explicit for attribute still wins)
const { labelId, target: labelTarget } = useFieldLabel();
</script>

<template>
    <Label :id="labelId" data-slot="field-label" :for="labelTarget" :class="cn(
        'group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50',
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded has-[>[data-slot=field]]:border *:data-[slot=field]:p-4',
        'has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10',
        props.class
    )
        ">
        <slot />
    </Label>
</template>