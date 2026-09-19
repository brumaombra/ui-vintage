<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '../../../lib/utils';
import type { HeadingLevel } from '../../../lib/common-types';

// Props
const props = withDefaults(defineProps<{
    class?: HTMLAttributes['class'];
    level?: HeadingLevel;
}>(), {
    level: 3
});
</script>

<template>
    <component :is="`h${props.level}`"
        data-slot="card-title"
        :class="cn('leading-none font-semibold text-sm sm:text-base', props.class)">
        <slot />
    </component>
</template>