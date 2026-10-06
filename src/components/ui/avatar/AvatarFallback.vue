<script setup lang="ts">
import type { AvatarFallbackProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { AvatarFallback } from 'reka-ui';
import { computed, inject } from 'vue';
import { cn } from '../../../lib/utils';
import { avatarContextKey, avatarShapeClasses, avatarTextClasses, getInitials } from '.';

// Props
const props = defineProps<AvatarFallbackProps & {
    name?: string;
    class?: HTMLAttributes['class'];
}>();

const delegatedProps = reactiveOmit(props, 'class', 'name');

// Size and shape come from the parent avatar
const context = inject(avatarContextKey, null);
const textClass = computed(() => avatarTextClasses[context?.size.value ?? 'md']);
const shapeClass = computed(() => avatarShapeClasses[context?.shape.value ?? 'circle']);

// Initials computed from the name prop
const initials = computed(() => getInitials(props.name));
</script>

<template>
    <AvatarFallback data-slot="avatar-fallback" v-bind="delegatedProps" :aria-label="props.name || undefined" :class="cn('flex size-full items-center justify-center bg-surface font-semibold uppercase text-muted-foreground', textClass, shapeClass, props.class)">
        <slot>{{ initials }}</slot>
    </AvatarFallback>
</template>