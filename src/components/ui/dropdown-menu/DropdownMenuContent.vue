<script setup lang="ts">
import type { DropdownMenuContentEmits, DropdownMenuContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { DropdownMenuContent, DropdownMenuPortal, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';
import { dropdownMenuStaggerClass, dropdownMenuSurfaceClass } from './classes';

defineOptions({
    inheritAttrs: false
});

// Props
const props = withDefaults(defineProps<DropdownMenuContentProps & { class?: HTMLAttributes['class'] }>(), {
    align: 'start',
    sideOffset: 6,
    collisionPadding: 8
});

// Emits
const emits = defineEmits<DropdownMenuContentEmits>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <DropdownMenuPortal>
        <DropdownMenuContent data-slot="dropdown-menu-content" v-bind="{ ...$attrs, ...forwarded }" :class="cn(
            dropdownMenuSurfaceClass,
            'max-h-(--reka-dropdown-menu-content-available-height)',
            dropdownMenuStaggerClass,
            props.class
        )
            ">
            <slot />
        </DropdownMenuContent>
    </DropdownMenuPortal>
</template>