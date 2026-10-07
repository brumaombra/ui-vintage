<script setup lang="ts">
import type { HTMLAttributes, Ref } from 'vue';
import { useEventListener, useMediaQuery, useMounted, useVModel } from '@vueuse/core';
import { useCookie } from 'nuxt/app';
import { TooltipProvider } from 'reka-ui';
import { computed, ref } from 'vue';
import { cn } from '../../../lib/utils';
import { provideSidebarContext, SIDEBAR_COOKIE_MAX_AGE, SIDEBAR_COOKIE_NAME, SIDEBAR_KEYBOARD_SHORTCUT, SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON } from './utils';

// Props
const props = withDefaults(defineProps<{
    defaultOpen?: boolean;
    open?: boolean;
    compact?: boolean;
    class?: HTMLAttributes['class'];
}>(), {
    defaultOpen: undefined,
    open: undefined,
    compact: false
});

// Emits
const emits = defineEmits<{
    'update:open': [open: boolean];
}>();

// Remembered open state, read per instance on both server and client so the first render matches
const sidebarCookie = useCookie<boolean | null>(SIDEBAR_COOKIE_NAME, {
    default: () => null,
    maxAge: SIDEBAR_COOKIE_MAX_AGE,
    path: '/'
});

// The mobile layout only exists in the browser: render the desktop markup until hydration is done
const isMounted = useMounted();
const matchesMobile = useMediaQuery('(max-width: 768px)');
const isMobile = computed(() => isMounted.value && matchesMobile.value);
const openMobile = ref(false);

const open = useVModel(props, 'open', emits, {
    defaultValue: props.defaultOpen ?? sidebarCookie.value !== false,
    passive: (props.open === undefined) as false
}) as Ref<boolean>;

function setOpen(value: boolean) {
    open.value = value; // emits('update:open', value)

    // Keep the sidebar state for the next visit
    sidebarCookie.value = value;
}

function setOpenMobile(value: boolean) {
    openMobile.value = value;
}

// Helper to toggle the sidebar.
function toggleSidebar() {
    return isMobile.value
        ? setOpenMobile(!openMobile.value)
        : setOpen(!open.value);
}

useEventListener('keydown', (event: KeyboardEvent) => {
    if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
    ) {
        event.preventDefault();
        toggleSidebar();
    }
});

// We add a state so that we can do data-state="expanded" or "collapsed"
const state = computed(() => (open.value ? 'expanded' : 'collapsed'));

provideSidebarContext({
    state,
    open,
    setOpen,
    isMobile,
    openMobile,
    setOpenMobile,
    toggleSidebar
});
</script>

<template>
    <TooltipProvider :delay-duration="0">
        <div data-slot="sidebar-wrapper" :style="{
            '--sidebar-width': SIDEBAR_WIDTH,
            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON
        }" :data-compact="props.compact ? 'true' : 'false'" :class="cn(
            'group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full',
            props.class
        )
            " v-bind="$attrs">
            <slot />
        </div>
    </TooltipProvider>
</template>