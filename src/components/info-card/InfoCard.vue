<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue';
import type { HTMLAttributes } from 'vue';
import { Card, CardContent, CardText } from '../ui/card';
import type { HugeiconsIconDefinition } from '../../lib/common-types';

// Props
const props = withDefaults(defineProps<{
    icon: HugeiconsIconDefinition;
    title?: string;
    description?: string | number;
    class?: HTMLAttributes['class'];
}>(), {
    title: '',
    description: ''
});
</script>

<template>
    <Card :class="['flex flex-col items-center p-4! sm:flex-row', props.class]">
        <CardContent class="flex w-full flex-col items-center gap-0 p-0! sm:flex-row">
            <!-- Icon -->
            <Card color="gray" class="mb-3 mr-0 flex h-12 w-12 shrink-0 items-center justify-center p-0! sm:mb-0 sm:mr-4">
                <HugeiconsIcon :icon="props.icon" class="size-5" />
            </Card>

            <!-- Content -->
            <div class="flex w-full flex-1 items-center justify-between text-center sm:w-auto sm:text-left">
                <div class="flex flex-col w-full gap-2 sm:gap-1">
                    <!-- Title -->
                    <span class="text-base font-bold text-(--text-primary-light) dark:text-(--text-primary-dark)">
                        {{ props.title }}
                    </span>

                    <!-- Description -->
                    <CardText v-if="props.description">
                        {{ props.description }}
                    </CardText>
                </div>

                <!-- Right slot for custom elements -->
                <div v-if="$slots.right" class="ml-4">
                    <slot name="right" />
                </div>
            </div>
        </CardContent>
    </Card>
</template>