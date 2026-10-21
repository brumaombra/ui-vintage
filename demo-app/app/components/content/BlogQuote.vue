<script setup>
import { BlogQuote as UiVintageBlogQuote } from '@brumaombra/ui-vintage/content';

// Props
const props = defineProps({
	author: { type: String, default: '' }
});
</script>

<template>
	<UiVintageBlogQuote :author="props.author">
		<slot />
	</UiVintageBlogQuote>
</template>