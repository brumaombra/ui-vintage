<script setup>
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Props
const props = defineProps({
    name: { type: String, required: true },
    image: { type: String, default: '' },
    count: { type: Number, required: true }
});
</script>

<template>
    <Card class="!p-0 overflow-hidden group cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
        <CardContent class="gap-0 !p-0">
            <!-- Background Image -->
            <div v-if="props.image" class="relative w-full h-36 overflow-hidden">
                <NuxtImg :src="props.image" :alt="props.name" height="225" width="400" format="avif" quality="35" :sizes="{ 480: '480px', 1280: '400px' }" loading="lazy" decoding="async" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>

            <!-- Content -->
            <div class="p-4 flex items-center justify-between">
                <!-- Name -->
                <span class="text-sm font-bold text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] truncate mr-3">
                    {{ props.name }}
                </span>

                <!-- Count -->
                <Badge color="gray" :text="String(props.count)" />
            </div>
        </CardContent>
    </Card>
</template>