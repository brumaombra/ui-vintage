<script setup lang="ts">
import type { AvatarImageEmits, AvatarImageProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { AvatarImage, useForwardPropsEmits } from 'reka-ui';
import { cn } from '../../../lib/utils';

// Props
const props = defineProps<AvatarImageProps & {
    class?: HTMLAttributes['class'];
}>();

// Emits
const emits = defineEmits<AvatarImageEmits>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <!-- Reka reveals the image only once loaded, which plays the zoom-in entrance -->
    <AvatarImage data-slot="avatar-image" v-bind="forwarded" :class="cn('aspect-square size-full object-cover animate-[uv-float-in_420ms_var(--ease-out-expo)_both]', props.class)" />
</template>