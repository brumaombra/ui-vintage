<script setup lang="ts">
import type { DropdownMenuSubContentEmits, DropdownMenuSubContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { DropdownMenuPortal, DropdownMenuSubContent, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';
import { dropdownMenuStaggerClass, dropdownMenuSurfaceClass } from './classes';

defineOptions({
    inheritAttrs: false
});

// Props
const props = withDefaults(defineProps<DropdownMenuSubContentProps & { class?: HTMLAttributes['class'] }>(), {
    sideOffset: 6,
    alignOffset: -5,
    collisionPadding: 8
});

// Emits
const emits = defineEmits<DropdownMenuSubContentEmits>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <DropdownMenuPortal>
        <DropdownMenuSubContent data-slot="dropdown-menu-sub-content" v-bind="{ ...$attrs, ...forwarded }" :class="cn(
            dropdownMenuSurfaceClass,
            'max-h-(--reka-dropdown-menu-content-available-height)',
            dropdownMenuStaggerClass,
            props.class
        )
            ">
            <slot />
        </DropdownMenuSubContent>
    </DropdownMenuPortal>
</template>