<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, useForwardPropsEmits } from 'reka-ui';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';
import { Button } from '../button';

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
        <DialogOverlay class="uv-overlay-motion fixed inset-0 isolate z-50 grid place-items-center overflow-y-auto bg-black/40 backdrop-blur-[3px] dark:bg-black/60">
            <DialogContent :class="cn(
                'uv-modal-motion relative z-50 my-6 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded border border-border bg-card p-6 text-card-foreground shadow-elevated-xl outline-none sm:max-w-106.25',
                props.class
            )
                " v-bind="{ ...$attrs, ...forwarded }" @pointer-down-outside="
                    (event) => {
                        const originalEvent = event.detail.originalEvent;
                        const target = originalEvent.target as HTMLElement;
                        if (
                            originalEvent.offsetX > target.clientWidth ||
                            originalEvent.offsetY > target.clientHeight
                        ) {
                            event.preventDefault();
                        }
                    }
                ">
                <slot />

                <DialogClose v-if="props.showCloseButton" data-slot="dialog-close" as-child>
                    <Button variant="ghost" size="icon-sm" class="group/close absolute top-3 right-3 size-8 p-0.5">
                        <HugeiconsIcon :icon="Cancel01Icon" aria-hidden="true" class="transition-transform duration-300 ease-spring group-hover/close:rotate-90" />
                        <span class="sr-only">{{ t('uiVintage.buttons.close') }}</span>
                    </Button>
                </DialogClose>
            </DialogContent>
        </DialogOverlay>
    </DialogPortal>
</template>