<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ButtonVariants } from '.';
import { Primitive } from 'reka-ui';
import { cn } from '../../../lib/utils';
import { Spinner } from '../spinner';
import { buttonVariants } from '.';

// Props
const props = withDefaults(defineProps<PrimitiveProps & {
    variant?: ButtonVariants['variant'];
    size?: ButtonVariants['size'];
    loading?: boolean;
    disabled?: boolean;
    class?: HTMLAttributes['class'];
}>(), {
    as: 'button',
    loading: false,
    disabled: false
});
</script>

<template>
    <Primitive data-slot="button" :data-variant="variant" :data-size="size" :data-loading="props.loading ? '' : undefined" :aria-busy="props.loading || undefined" :disabled="props.disabled || props.loading || undefined" :as="as" :as-child="asChild" :class="cn(buttonVariants({ variant, size }), props.class)">
        <!-- As-child buttons delegate rendering to the slotted element -->
        <slot v-if="asChild" />

        <template v-else>
            <!-- Content (kept in the layout while loading so the width never jumps) -->
            <span v-if="props.loading" class="invisible contents">
                <slot />
            </span>
            <slot v-else />

            <!-- Loading indicator -->
            <span v-if="props.loading" class="absolute inset-0 flex items-center justify-center">
                <Spinner size="sm" />
            </span>
        </template>
    </Primitive>
</template>