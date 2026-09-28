<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { onMounted, ref } from 'vue';
import { cn } from '../../../lib/utils';
import Kbd from './Kbd.vue';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
    keys?: string[];
    pressed?: boolean;
}>();

// Default to non-Mac glyphs so SSR output is stable, then refine on the client
const isMac = ref(false);

onMounted(() => {
    isMac.value = /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);
});

// Map special key names to their display glyph
const formatKey = (key: string) => {
    switch (key.toLowerCase()) {
        case 'mod':
            return isMac.value ? '⌘' : 'Ctrl';
        case 'cmd':
        case 'meta':
            return isMac.value ? '⌘' : 'Win';
        case 'ctrl':
        case 'control':
            return isMac.value ? '⌃' : 'Ctrl';
        case 'shift':
            return '⇧';
        case 'alt':
        case 'option':
            return isMac.value ? '⌥' : 'Alt';
        case 'enter':
        case 'return':
            return '↵';
        case 'esc':
        case 'escape':
            return 'Esc';
        case 'tab':
            return 'Tab';
        case 'backspace':
            return '⌫';
        case 'up':
            return '↑';
        case 'down':
            return '↓';
        case 'left':
            return '←';
        case 'right':
            return '→';
        case 'space':
            return 'Space';
        default:
            return key.length === 1 ? key.toUpperCase() : key;
    }
};
</script>

<template>
    <span data-slot="kbd-group" :class="cn('inline-flex items-center gap-1', props.class)">
        <slot>
            <!-- Keys rendered from the keys prop -->
            <Kbd v-for="(key, index) in props.keys ?? []" :key="`${key}-${index}`" :pressed="props.pressed">
                {{ formatKey(key) }}
            </Kbd>
        </slot>
    </span>
</template>