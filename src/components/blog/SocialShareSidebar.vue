<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Facebook01Icon, Linkedin01Icon, NewTwitterIcon, Share08Icon, TelegramIcon, WhatsappIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Card, CardContent } from '../ui/card';

// Props
const props = defineProps<{
    title: string;
    url: string;
}>();

const { t } = useI18n();

// Social platforms config
const socialPlatforms = computed(() => {
    const encodedUrl = encodeURIComponent(props.url);
    const encodedTitle = encodeURIComponent(props.title);

    return [{
        name: 'facebook',
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        icon: Facebook01Icon,
        color: 'bg-blue-700 hover:bg-blue-800',
        label: t('uiVintage.blog.share.facebook')
    }, {
        name: 'twitter',
        url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        icon: NewTwitterIcon,
        color: 'bg-black hover:bg-gray-800',
        label: t('uiVintage.blog.share.x')
    }, {
        name: 'whatsapp',
        url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
        icon: WhatsappIcon,
        color: 'bg-green-500 hover:bg-green-600',
        label: t('uiVintage.blog.share.whatsapp')
    }, {
        name: 'linkedin',
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        icon: Linkedin01Icon,
        color: 'bg-blue-700 hover:bg-blue-800',
        label: t('uiVintage.blog.share.linkedin')
    }, {
        name: 'telegram',
        url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
        icon: TelegramIcon,
        color: 'bg-blue-400 hover:bg-blue-500',
        label: t('uiVintage.blog.share.telegram')
    }];
});
</script>

<template>
    <Teleport to="body">
        <!-- Desktop sidebar on the right -->
        <div class="fixed right-[calc(50%-600px)] top-35 z-20 hidden xl:block">
            <Card class="p-5! flex flex-col space-y-4 items-center">
                <CardContent class="p-0! gap-4 items-center">
                    <!-- Share icon -->
                    <HugeiconsIcon :icon="Share08Icon" class="size-5 text-(--text-secondary-light) dark:text-(--text-secondary-dark) mb-2" />

                    <!-- Social share links (desktop) -->
                    <template v-for="platform in socialPlatforms" :key="platform.name">
                        <NuxtLink :to="platform.url"
                            target="_blank"
                            rel="noopener noreferrer"
                            :aria-label="platform.label"
                            :class="['w-10 h-10 rounded flex items-center justify-center text-white transition-all duration-200 hover:opacity-80 hover:scale-105', platform.color]">
                            <HugeiconsIcon :icon="platform.icon" class="size-4" />
                        </NuxtLink>
                    </template>
                </CardContent>
            </Card>
        </div>

        <!-- Mobile view (floating bar at bottom) -->
        <div class="fixed bottom-4 left-1/2 z-20 -translate-x-1/2 xl:hidden">
            <Card class="p-3! w-fit">
                <CardContent class="flex-row! p-0! items-center justify-center gap-3">
                    <!-- Social share links (mobile) -->
                    <template v-for="platform in socialPlatforms" :key="platform.name">
                        <NuxtLink :to="platform.url"
                            target="_blank"
                            rel="noopener noreferrer"
                            :aria-label="platform.label"
                            :class="['w-10 h-10 rounded flex items-center justify-center text-white transition-all duration-200 hover:opacity-80 hover:scale-105', platform.color]">
                            <HugeiconsIcon :icon="platform.icon" class="size-4" />
                        </NuxtLink>
                    </template>
                </CardContent>
            </Card>
        </div>
    </Teleport>
</template>