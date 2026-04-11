<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { computed } from "vue";
import { ArrowLeft } from "lucide-vue-next";
import BackgroundGrid from "@/components/background-grid/BackgroundGrid.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ErrorPageProps {
    statusCode?: number | string;
    label?: string;
    title?: string;
    message?: string;
    actionLabel?: string;
    showBackground?: boolean;
    showDefaultAction?: boolean;
    class?: HTMLAttributes["class"];
    cardClass?: HTMLAttributes["class"];
    contentClass?: HTMLAttributes["class"];
    footerClass?: HTMLAttributes["class"];
}

// Props
const props = withDefaults(defineProps<ErrorPageProps>(), {
    statusCode: 500,
    label: "Error",
    title: undefined,
    message: undefined,
    actionLabel: "Go back",
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
    if (resolvedStatusCode.value === "404") return "Page not found";
    return "Something went wrong";
});

// Resolve the supporting message.
const resolvedMessage = computed(() => {
    if (props.message) return props.message;
    if (resolvedStatusCode.value === "404") return "The page you requested could not be found or may have been moved.";
    return "An unexpected error interrupted the current flow. Please try again or go back to a safe page.";
});

// Emit the default action.
const handleAction = () => {
    emit("action");
};
</script>

<template>
    <div :class="cn('relative min-h-screen bg-[var(--bg-main-light)] text-[var(--text-primary-light)] dark:bg-[var(--bg-main-dark)] dark:text-[var(--text-primary-dark)]', props.class)">
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
                            <div class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--button-primary-light)] dark:text-[var(--button-primary-dark)]">
                                {{ props.label }} {{ resolvedStatusCode }}
                            </div>

                            <!-- Title -->
                            <h1 class="mt-3 text-2xl font-bold">
                                {{ resolvedTitle }}
                            </h1>

                            <!-- Message -->
                            <p class="mt-4 text-sm leading-7 text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)] sm:text-base">
                                {{ resolvedMessage }}
                            </p>
                        </div>
                    </CardContent>

                    <!-- Actions -->
                    <CardFooter :class="cn('items-start flex-col gap-3 sm:flex-row sm:items-center', props.footerClass)">
                        <slot name="actions" :on-action="handleAction">
                            <Button v-if="props.showDefaultAction" variant="default" @click="handleAction">
                                <ArrowLeft class="size-4" :stroke-width="1.8" />
                                {{ props.actionLabel }}
                            </Button>
                        </slot>
                    </CardFooter>
                </Card>
            </div>
        </main>
    </div>
</template>