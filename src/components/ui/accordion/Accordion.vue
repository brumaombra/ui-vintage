<script setup lang="ts">
import { ref } from "vue";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/vue";
import { Card, CardContent } from "@brumaombra/ui-vintage/card";

interface AccordionProps {
    title: string;
    initiallyExpanded?: boolean;
}

// Props
const props = withDefaults(defineProps<AccordionProps>(), {
    initiallyExpanded: false
});

const expanded = ref(props.initiallyExpanded);

// Toggle expanded state
const toggleExpanded = () => {
    expanded.value = !expanded.value;
};
</script>

<template>
    <Card class="p-0! overflow-hidden" @click="toggleExpanded">
        <CardContent class="p-0! gap-0">
            <!-- Header -->
            <div class="flex items-center justify-between p-5 gap-4">
                <!-- Title -->
                <div class="text-sm md:text-base! font-semibold text-(--text-primary-light) dark:text-(--text-primary-dark) text-left">
                    {{ props.title }}
                </div>

                <!-- Toggle icon -->
                <div class="shrink-0 w-8 h-8 flex items-center justify-center rounded bg-(--bg-card-light) dark:bg-(--bg-card-dark) border border-(--border-light) dark:border-(--border-dark) transition-transform duration-300 cursor-pointer" :class="{ 'rotate-180': expanded }">
                    <HugeiconsIcon :icon="ArrowDown01Icon" class="size-4 text-(--text-secondary-light) dark:text-(--text-secondary-dark)" />
                </div>
            </div>

            <!-- Content -->
            <div :class="['grid transition-all duration-300 ease-in-out', expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0']">
                <div :class="['overflow-hidden px-5 transition-[padding] duration-300 ease-in-out', expanded ? 'pb-5' : 'pb-0']">
                    <slot />
                </div>
            </div>
        </CardContent>
    </Card>
</template>