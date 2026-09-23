<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { PanelLeftIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';
import { Button } from '../button';
import { useSidebar } from './utils';

// Props
const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();

const { t } = useI18n();
const { toggleSidebar } = useSidebar();
</script>

<template>
    <Button data-sidebar="trigger" data-slot="sidebar-trigger" variant="secondary" size="icon" :class="cn(props.class)" @click="toggleSidebar">
        <HugeiconsIcon :icon="PanelLeftIcon" />
        <span class="sr-only">{{ t('uiVintage.sidebar.toggle') }}</span>
    </Button>
</template>