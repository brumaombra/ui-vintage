<script setup lang="ts">
import type { PopoverAnchorProps } from 'reka-ui';
import { PopoverAnchor } from 'reka-ui';

// Props
const props = defineProps<PopoverAnchorProps>();
</script>

<template>
    <PopoverAnchor data-slot="popover-anchor" v-bind="props">
        <slot />
    </PopoverAnchor>
</template>