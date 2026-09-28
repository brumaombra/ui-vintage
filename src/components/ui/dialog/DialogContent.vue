<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { DialogClose, DialogContent, DialogPortal, useForwardPropsEmits } from 'reka-ui';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';
import { Button } from '../button';
import DialogOverlay from './DialogOverlay.vue';

defineOptions({
    inheritAttrs: false
});

// Props
const props = withDefaults(defineProps<DialogContentProps & {
    class?: HTMLAttributes['class'];
    showCloseButton?: boolean;
}>(), {
    showCloseButton: false
});

const { t } = useI18n();

// Emits
const emits = defineEmits<DialogContentEmits>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <DialogPortal>
        <DialogOverlay />
        <DialogContent data-slot="dialog-content" v-bind="{ ...$attrs, ...forwarded }" :class="cn(
            'uv-modal-motion bg-card text-card-foreground fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded border border-border p-6 shadow-elevated-xl outline-none sm:max-w-106.25',
            props.class
        )
            ">
            <slot />

            <DialogClose v-if="props.showCloseButton" data-slot="dialog-close" as-child>
                <Button variant="ghost" size="icon-sm" class="group/close absolute top-3 right-3 size-8 p-0.5">
                    <HugeiconsIcon :icon="Cancel01Icon" aria-hidden="true" class="transition-transform duration-300 ease-spring group-hover/close:rotate-90" />
                    <span class="sr-only">{{ t('uiVintage.buttons.close') }}</span>
                </Button>
            </DialogClose>
        </DialogContent>
    </DialogPortal>
</template>