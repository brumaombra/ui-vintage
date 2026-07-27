<script setup lang="ts">
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { computed, type HTMLAttributes } from 'vue';
import BackgroundGrid from '../background-grid/BackgroundGrid.vue';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { cn } from '../../lib/utils';

// Props
const props = withDefaults(defineProps<{
    statusCode?: number | string;
    label?: string;
    title?: string;
    message?: string;
    actionLabel?: string;
    showBackground?: boolean;
    showDefaultAction?: boolean;
    class?: HTMLAttributes['class'];
    cardClass?: HTMLAttributes['class'];
    contentClass?: HTMLAttributes['class'];
    footerClass?: HTMLAttributes['class'];
}>(), {
    statusCode: 500,
    label: 'Error',
    title: undefined,
    message: undefined,
    actionLabel: 'Go back',
    showBackground: true,
    showDefaultAction: true,
    class: undefined,
    cardClass: undefined,
    contentClass: undefined,
    footerClass: undefined
});

// Emits
const emit = defineEmits<{
    action: [];
}>();

const resolvedStatusCode = computed(() => String(props.statusCode ?? 500));

// Resolve the heading copy.
const resolvedTitle = computed(() => {
    if (props.title) return props.title;
    if (resolvedStatusCode.value === '404') return 'Page not found';
    return 'Something went wrong';
});

// Resolve the supporting message.
const resolvedMessage = computed(() => {
    if (props.message) return props.message;
    if (resolvedStatusCode.value === '404') return 'The page you requested could not be found or may have been moved.';
    return 'An unexpected error interrupted the current flow. Please try again or go back to a safe page.';
});

// Emit the default action.
const handleAction = () => {
    emit('action');
};
</script>

<template>
    <div :class="cn('relative min-h-screen bg-(--bg-main-light) text-(--text-primary-light) dark:bg-(--bg-main-dark) dark:text-(--text-primary-dark)', props.class)">
        <!-- Decorative background -->
        <BackgroundGrid v-if="props.showBackground" />

        <!-- Main content -->
        <main class="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
            <div class="w-full max-w-xl">
                <!-- Toolbar -->
                <div v-if="$slots.toolbar" class="mb-4 flex justify-end gap-3">
                    <slot name="toolbar" />
                </div>

                <!-- Error card -->
                <Card :class="props.cardClass">
                    <CardContent :class="cn('space-y-8', props.contentClass)">
                        <!-- Brand -->
                        <slot name="brand" />

                        <!-- Error copy -->
                        <div>
                            <!-- Status code -->
                            <div class="text-sm font-semibold uppercase tracking-[0.24em] text-(--button-primary-light) dark:text-(--button-primary-dark)">
                                {{ props.label }} {{ resolvedStatusCode }}
                            </div>

                            <!-- Title -->
                            <h1 class="text-2xl font-bold mt-3">
                                {{ resolvedTitle }}
                            </h1>

                            <!-- Message -->
                            <p class="text-sm leading-7 text-(--text-secondary-light) dark:text-(--text-secondary-dark) sm:text-base mt-4">
                                {{ resolvedMessage }}
                            </p>
                        </div>
                    </CardContent>

                    <!-- Actions -->
                    <CardFooter :class="cn('items-start flex-col gap-3 sm:flex-row sm:items-center', props.footerClass)">
                        <slot name="actions" :on-action="handleAction">
                            <Button v-if="props.showDefaultAction" variant="primary" @click="handleAction">
                                <HugeiconsIcon :icon="ArrowLeft01Icon" :stroke-width="1.8" class="size-4" />
                                {{ props.actionLabel }}
                            </Button>
                        </slot>
                    </CardFooter>
                </Card>
            </div>
        </main>
    </div>
</template>