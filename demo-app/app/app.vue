<script setup>
// Every page declares its language and direction (the blog pages also add their SEO links)
const localeHead = useLocaleHead();
useHead({
    htmlAttrs: {
        lang: () => localeHead.value.htmlAttrs.lang,
        dir: () => localeHead.value.htmlAttrs.dir
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