<script setup lang="ts">
import { NuxtImg } from '#components';
import ArrowRight01Icon from '@hugeicons/core-free-icons/ArrowRight01Icon';
import Folder01Icon from '@hugeicons/core-free-icons/Folder01Icon';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card } from '../ui/card';

// Props
const props = withDefaults(defineProps<{
	name: string;
	image?: string;
	count: number;
}>(), {
	image: ''
});
</script>

<template>
	<Card padding="none" interactive class="group/category h-full">
		<!-- Image -->
		<div class="h-32 w-full overflow-hidden border-b border-border bg-surface">
			<NuxtImg v-if="props.image" :src="props.image" :alt="props.name" height="225" width="400" format="avif" quality="35" :sizes="{ 480: '480px', 1280: '400px' }" loading="lazy" decoding="async" class="size-full object-cover transition-[scale] duration-700 ease-out-expo group-hover/category:scale-[1.03]" />

			<!-- Fallback when there is no image -->
			<div v-else aria-hidden="true" class="flex size-full items-center justify-center text-primary/60">
				<HugeiconsIcon :icon="Folder01Icon" class="size-8" />
			</div>
		</div>

		<!-- Name, post count and arrow -->
		<div class="flex grow items-center gap-3 bg-surface px-4 py-3 transition-colors duration-200 group-hover/category:bg-primary/10">
			<!-- On hover the orange underline draws in from the left and wipes out to the right -->
			<span class="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
				<span class="bg-linear-to-r from-primary to-primary bg-[length:0%_2px] bg-[position:100%_100%] bg-no-repeat transition-[background-size] duration-500 ease-out-expo group-hover/category:bg-[length:100%_2px] group-hover/category:bg-[position:0_100%]">{{ props.name }}</span>
			</span>
			<span class="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-semibold leading-5 text-muted-foreground tabular-nums">
				<span aria-hidden="true" class="size-1.5 rounded-full bg-primary" />
				{{ props.count }}
			</span>
			<HugeiconsIcon :icon="ArrowRight01Icon" class="size-4 shrink-0 text-muted-foreground transition-[translate,color] duration-300 ease-spring group-hover/category:translate-x-1 group-hover/category:text-primary" />
		</div>
	</Card>
</template>