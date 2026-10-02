<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { Primitive } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = withDefaults(defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>(), {
    as: 'a'
});
</script>

<template>
    <Primitive data-slot="breadcrumb-link" :as="as" :as-child="asChild" :class="cn('rounded-sm bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat text-muted-foreground outline-none transition-[color,background-size] duration-300 ease-out-expo hover:bg-[length:100%_1px] hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/45', props.class)">
        <slot />
    </Primitive>
</template>