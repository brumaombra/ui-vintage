<script setup lang="ts">
// Props
const props = withDefaults(defineProps<{
    title: string;
    description?: string;
}>(), {
    description: ''
});
</script>

<template>
    <div data-aos="blur-up" class="relative mb-6 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between md:mb-8">
        <!-- Primary segment at the start of the rule -->
        <span aria-hidden="true" class="absolute -bottom-px left-0 h-0.5 w-12 bg-primary" />

        <div class="min-w-0">
            <!-- Title -->
            <h2 class="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                {{ props.title }}
            </h2>

            <!-- Description -->
            <p v-if="props.description" class="mt-1 max-w-2xl text-xs leading-6 text-muted-foreground md:text-sm">
                {{ props.description }}
            </p>
        </div>

        <!-- Optional trailing action (for example a "View all" link) -->
        <div v-if="$slots.action" class="shrink-0">
            <slot name="action" />
        </div>
    </div>
</template>
