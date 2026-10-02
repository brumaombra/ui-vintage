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
    <div data-aos="blur-up" class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between md:mb-8">
        <div class="min-w-0">
            <!-- Title with accent bar -->
            <h2 class="flex items-center gap-3 text-xl font-bold tracking-tight text-foreground md:text-2xl">
                <span aria-hidden="true" class="h-6 w-1 shrink-0 rounded-full bg-primary shadow-glow md:h-7" />
                {{ props.title }}
            </h2>

            <!-- Description -->
            <p v-if="props.description" class="mt-2 max-w-2xl text-xs leading-6 text-muted-foreground md:text-sm">
                {{ props.description }}
            </p>
        </div>

        <!-- Optional trailing action (for example a "View all" link) -->
        <div v-if="$slots.action" class="shrink-0">
            <slot name="action" />
        </div>
    </div>
</template>