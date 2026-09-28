<script setup lang="ts">
import type { DropdownMenuSubEmits, DropdownMenuSubProps } from 'reka-ui';
import { DropdownMenuSub, useForwardPropsEmits } from 'reka-ui';

// Props
const props = defineProps<DropdownMenuSubProps>();

// Emits
const emits = defineEmits<DropdownMenuSubEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
    <DropdownMenuSub v-slot="slotProps" data-slot="dropdown-menu-sub" v-bind="forwarded">
        <slot v-bind="slotProps" />
    </DropdownMenuSub>
</template>