<script setup lang="ts">
import type { DropdownMenuRadioGroupEmits, DropdownMenuRadioGroupProps } from 'reka-ui';
import { DropdownMenuRadioGroup, useForwardPropsEmits } from 'reka-ui';

// Props
const props = defineProps<DropdownMenuRadioGroupProps>();

// Emits
const emits = defineEmits<DropdownMenuRadioGroupEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
    <DropdownMenuRadioGroup data-slot="dropdown-menu-radio-group" v-bind="forwarded">
        <slot />
    </DropdownMenuRadioGroup>
</template>