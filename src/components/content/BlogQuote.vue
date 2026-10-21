<script setup lang="ts">
import QuoteDownIcon from '@hugeicons/core-free-icons/QuoteDownIcon';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card } from '../ui/card';

// Props (the quote is the default slot, so it can hold inline markdown: ::BlogQuote{author="..."} Text of the quote ::)
const props = withDefaults(defineProps<{
	author?: string;
}>(), {
	author: ''
});
</script>

<template>
	<figure class="not-prose my-6 sm:my-8">
		<Card data-aos="blur-up" class="relative gap-0! overflow-hidden border-l-2 border-l-primary px-5 py-4 sm:px-6 sm:py-5">
			<!-- Quote mark -->
			<HugeiconsIcon :icon="QuoteDownIcon" aria-hidden="true" :stroke-width="1.6" class="mb-2 size-5 text-primary" />

			<!-- Quote -->
			<blockquote class="text-sm leading-relaxed font-medium text-foreground md:text-base [&_p]:m-0">
				<slot />
			</blockquote>

			<!-- Author -->
			<figcaption v-if="props.author" class="mt-3 text-xs text-muted-foreground md:text-sm">
				— {{ props.author }}
			</figcaption>
		</Card>
	</figure>
</template>