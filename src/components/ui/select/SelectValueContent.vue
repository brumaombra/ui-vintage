<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import type { SelectValueProps } from 'reka-ui';
import { SelectValue } from 'reka-ui';
import { cn } from '../../../lib/utils';
import type { HugeiconsIconDefinition } from '../../../lib/common-types';

// Props
const props = defineProps<SelectValueProps & {
    class?: HTMLAttributes['class'];
    icon?: HugeiconsIconDefinition | null;
    label?: string | number | null;
    description?: string | number | null;
    iconClass?: HTMLAttributes['class'];
    textClass?: HTMLAttributes['class'];
    descriptionClass?: HTMLAttributes['class'];
}>();
</script>

<template>
    <SelectValue data-slot="select-value-content" :placeholder="props.placeholder" :class="cn(
        'flex min-w-0 flex-1 gap-1.5 text-left sm:gap-2',
        props.description ? 'items-start' : 'items-center',
        props.class
    )
        ">
        <template v-if="props.label != null || props.description != null">
            <!-- Icon -->
            <div v-if="props.icon" data-slot="select-value-content-icon" :class="cn('shrink-0', props.iconClass)">
                <HugeiconsIcon :icon="props.icon" />
            </div>

            <!-- Text and description -->
            <div class="flex min-w-0 flex-1 flex-col gap-0.5">
                <!-- Text -->
                <span data-slot="select-value-content-text" :class="cn(
                    'min-w-0 whitespace-normal wrap-break-word text-xs leading-5 sm:truncate sm:text-sm max-sm:[display:-webkit-box] max-sm:overflow-hidden max-sm:[-webkit-box-orient:vertical] max-sm:[-webkit-line-clamp:2]',
                    props.textClass
                )
                    ">
                    {{ props.label }}
                </span>

                <!-- Description -->
                <span v-if="props.description" data-slot="select-value-content-description" :class="cn(
                    'min-w-0 whitespace-normal wrap-break-word text-[11px] leading-4 text-(--text-secondary-light) dark:text-(--text-secondary-dark) sm:text-xs sm:leading-5 max-sm:[display:-webkit-box] max-sm:overflow-hidden max-sm:[-webkit-box-orient:vertical] max-sm:[-webkit-line-clamp:3]',
                    props.descriptionClass
                )
                    ">
                    {{ props.description }}
                </span>
            </div>
        </template>
    </SelectValue>
</template>