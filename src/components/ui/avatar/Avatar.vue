<script setup lang="ts">
import type { AvatarRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { AvatarShape, AvatarSize, AvatarStatus } from '.';
import { reactiveOmit } from '@vueuse/core';
import { AvatarRoot } from 'reka-ui';
import { computed, provide, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';
import { avatarContextKey, avatarShapeClasses, avatarSizeClasses } from '.';

// Props
const props = withDefaults(defineProps<AvatarRootProps & {
    size?: AvatarSize;
    shape?: AvatarShape;
    status?: AvatarStatus;
    class?: HTMLAttributes['class'];
}>(), {
    size: 'md',
    shape: 'circle',
});

const delegatedProps = reactiveOmit(props, 'class', 'size', 'shape', 'status');

const { t } = useI18n();

// Share size and shape with the image and fallback
provide(avatarContextKey, { size: toRef(props, 'size'), shape: toRef(props, 'shape') });

// Status dot size scales with the avatar
const statusSizeClasses: Record<AvatarSize, string> = {
    xs: 'size-2',
    sm: 'size-2.5',
    md: 'size-3',
    lg: 'size-3.5',
    xl: 'size-4',
};

// Status dot color
const statusColorClasses: Record<AvatarStatus, string> = {
    online: 'bg-success',
    offline: 'bg-muted-foreground',
    busy: 'bg-destructive',
    away: 'bg-warning',
};

// Square avatars tuck the dot slightly outside the corner
const statusPositionClass = computed(() => props.shape === 'square' ? '-right-0.5 -bottom-0.5' : 'right-0 bottom-0');
</script>

<template>
    <span data-slot="avatar" :data-size="props.size" :data-shape="props.shape" :data-status="props.status" :class="cn('relative inline-flex shrink-0 select-none align-middle', avatarSizeClasses[props.size], avatarShapeClasses[props.shape], props.class)">
        <!-- Avatar surface -->
        <AvatarRoot v-bind="delegatedProps" :class="cn('relative flex size-full items-center justify-center overflow-hidden bg-surface', avatarShapeClasses[props.shape])">
            <slot />
        </AvatarRoot>

        <!-- Status dot -->
        <span v-if="props.status" data-slot="avatar-status" :class="cn('absolute rounded-full ring-2 ring-background', statusSizeClasses[props.size], statusPositionClass)">
            <!-- Soft halo for online presence -->
            <span v-if="props.status === 'online'" aria-hidden="true" :class="cn('absolute inset-0 rounded-full animate-uv-ping-soft', statusColorClasses[props.status])" />
            <span aria-hidden="true" :class="cn('relative block size-full rounded-full animate-uv-pop', statusColorClasses[props.status])" />
            <span class="sr-only">{{ t(`uiVintage.avatar.status.${props.status}`) }}</span>
        </span>
    </span>
</template>