<script setup lang="ts">
import type { HTMLAttributes, VNode } from 'vue';
import type { AvatarShape, AvatarSize } from '.';
import { Comment, Fragment, Text, useSlots } from 'vue';
import { cn } from '../../../lib/utils';
import { avatarShapeClasses, avatarSizeClasses, avatarTextClasses } from '.';

// Props
const props = withDefaults(defineProps<{
    max?: number;
    size?: AvatarSize;
    shape?: AvatarShape;
    class?: HTMLAttributes['class'];
}>(), {
    size: 'md',
    shape: 'circle',
});

const slots = useSlots();

// Flatten slot vnodes (v-for fragments) and drop comments / whitespace text
function flatten(nodes: VNode[]): VNode[] {
    const result: VNode[] = [];
    for (const node of nodes) {
        if (node.type === Comment) continue;
        if (node.type === Text && typeof node.children === 'string' && !node.children.trim()) continue;
        if (node.type === Fragment && Array.isArray(node.children)) {
            result.push(...flatten(node.children as VNode[]));
            continue;
        }
        result.push(node);
    }
    return result;
}

// Children are read at render time so slot changes are always reflected
function getChildren() {
    return flatten(slots.default?.() ?? []);
}

// Overlap per size, kept clear of the initials so stacked fallbacks stay readable
const overlapClasses: Record<AvatarSize, string> = {
    xs: '-space-x-1',
    sm: '-space-x-1.5',
    md: '-space-x-2',
    lg: '-space-x-2.5',
    xl: '-space-x-3'
};

// Whether a max limit applies
function hasMax() {
    return props.max !== undefined && props.max >= 0;
}

// Avatars that fit within max
function getVisible() {
    const children = getChildren();
    return hasMax() ? children.slice(0, props.max) : children;
}

// Number of avatars hidden behind the +N bubble
function getOverflow() {
    return hasMax() ? Math.max(0, getChildren().length - (props.max ?? 0)) : 0;
}

// Renders a vnode as-is
const VNodeRenderer = (renderProps: { node: VNode }) => renderProps.node;
</script>

<template>
    <div data-slot="avatar-group" :class="cn(
        'flex items-center',
        overlapClasses[props.size],
        '*:ring-2 *:ring-background',
        props.class
    )">
        <!-- Visible avatars -->
        <VNodeRenderer v-for="(node, index) in getVisible()" :key="node.key ?? index" :node="node" />

        <!-- Overflow bubble -->
        <span v-if="getOverflow() > 0" data-slot="avatar-group-overflow" :class="cn('relative inline-flex shrink-0 select-none items-center justify-center bg-surface font-semibold text-muted-foreground', avatarSizeClasses[props.size], avatarShapeClasses[props.shape], avatarTextClasses[props.size])">
            +{{ getOverflow() }}
        </span>
    </div>
</template>