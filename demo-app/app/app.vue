<script setup>
// Every page declares its language and direction (the blog pages also add their SEO links)
const localeHead = useLocaleHead();
useHead({
	// HTML attributes
	htmlAttrs: {
		lang: () => localeHead.value.htmlAttrs.lang, // Language
		dir: () => localeHead.value.htmlAttrs.dir // Text direction
	}
});
</script>

<template>
	<!-- Route loading bar in the brand color -->
	<NuxtLoadingIndicator color="var(--primary)" :height="2" />

	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>