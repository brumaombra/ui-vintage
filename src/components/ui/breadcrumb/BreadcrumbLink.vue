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
    <Primitive data-slot="breadcrumb-link" :as="as" :as-child="asChild" :class="cn('text-muted-foreground hover:underline', props.class)">
        <slot />
    </Primitive>
</template>