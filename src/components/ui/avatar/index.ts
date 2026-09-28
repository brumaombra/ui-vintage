import type { InjectionKey, Ref } from 'vue';

export { default as Avatar } from './Avatar.vue';
export { default as AvatarFallback } from './AvatarFallback.vue';
export { default as AvatarGroup } from './AvatarGroup.vue';
export { default as AvatarImage } from './AvatarImage.vue';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

// Box size per avatar size (24/32/40/48/64px)
export const avatarSizeClasses: Record<AvatarSize, string> = {
    xs: 'size-6',
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-12',
    xl: 'size-16',
};

// Initials text size per avatar size
export const avatarTextClasses: Record<AvatarSize, string> = {
    xs: 'text-[10px]',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
};

// Corner radius per avatar shape
export const avatarShapeClasses: Record<AvatarShape, string> = {
    circle: 'rounded-full',
    square: 'rounded',
};

// Context shared by an avatar with its image and fallback
export const avatarContextKey: InjectionKey<{ size: Ref<AvatarSize>; shape: Ref<AvatarShape> }> = Symbol('uv-avatar');

// Compute up to 2 initials from a full name
export function getInitials(name: string | null | undefined): string {
    const words = (name ?? '').trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '';

    // Single word: first two characters, otherwise first letter of the first and last word
    if (words.length === 1) return Array.from(words[0]!).slice(0, 2).join('').toUpperCase();
    return (Array.from(words[0]!)[0]! + Array.from(words[words.length - 1]!)[0]!).toUpperCase();
}