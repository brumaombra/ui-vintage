<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Facebook01Icon, Link01Icon, Linkedin01Icon, NewTwitterIcon, Share08Icon, TelegramIcon, Tick02Icon, WhatsappIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';

// Props
const props = defineProps<{
    title: string;
    url: string;
}>();

const { t } = useI18n();
const copied = ref(false);

// Social platforms config (each one lights up in its brand color on hover)
const socialPlatforms = computed(() => {
    const encodedUrl = encodeURIComponent(props.url);
    const encodedTitle = encodeURIComponent(props.title);

    return [{
        name: 'facebook',
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        icon: Facebook01Icon,
        color: 'hover:border-[#1877F2] hover:bg-[#1877F2]',
        label: t('uiVintage.blog.share.facebook')
    }, {
        name: 'twitter',
        url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        icon: NewTwitterIcon,
        color: 'hover:border-foreground hover:bg-foreground hover:text-background!',
        label: t('uiVintage.blog.share.x')
    }, {
        name: 'whatsapp',
        url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
        icon: WhatsappIcon,
        color: 'hover:border-[#25D366] hover:bg-[#25D366]',
        label: t('uiVintage.blog.share.whatsapp')
    }, {
        name: 'linkedin',
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        icon: Linkedin01Icon,
        color: 'hover:border-[#0A66C2] hover:bg-[#0A66C2]',
        label: t('uiVintage.blog.share.linkedin')
    }, {
        name: 'telegram',
        url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
        icon: TelegramIcon,
        color: 'hover:border-[#229ED9] hover:bg-[#229ED9]',
        label: t('uiVintage.blog.share.telegram')
    }];
});

// Shared button classes
const buttonClasses = 'flex size-10 cursor-pointer items-center justify-center rounded border border-border bg-secondary text-muted-foreground shadow-elevated-sm outline-none [transition:background-color_150ms,border-color_150ms,color_150ms,scale_300ms_var(--ease-spring)] hover:scale-110 hover:text-white active:scale-95 focus-visible:ring-[3px] focus-visible:ring-ring/45';

// Copy the article link to the clipboard
const copyLink = async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(props.url);
    copied.value = true;
    window.setTimeout(() => {
        copied.value = false;
    }, 1800);
};
</script>

<template>
    <Teleport to="body">
        <!-- Desktop sidebar on the right -->
        <div class="fixed top-35 right-[max(6.875rem,calc(50%-38.125rem))] z-20 hidden animate-[uv-fade-up_0.7s_var(--ease-out-expo)_0.6s_both] xl:block 2xl:right-[max(0rem,calc(50%-35.125rem))]">
            <div class="flex flex-col items-center gap-3 rounded border border-border bg-card p-3 shadow-elevated-sm">
                <!-- Share icon -->
                <HugeiconsIcon :icon="Share08Icon" class="mb-1 size-5 text-primary" />

                <!-- Social share links (desktop) -->
                <a v-for="platform in socialPlatforms" :key="platform.name" :href="platform.url" target="_blank" rel="noopener noreferrer" :aria-label="platform.label" :title="platform.label" :class="[buttonClasses, platform.color]">
                    <HugeiconsIcon :icon="platform.icon" class="size-4" />
                </a>

                <!-- Copy link -->
                <div class="my-1 h-px w-6 bg-border" />
                <button type="button" :aria-label="copied ? t('uiVintage.blog.share.copied') : t('uiVintage.blog.share.copy')" :title="t('uiVintage.blog.share.copy')" :class="[buttonClasses, 'hover:border-primary hover:bg-primary hover:text-primary-foreground!', copied && 'border-primary text-primary']" @click="copyLink">
                    <Transition mode="out-in" enter-active-class="transition-[opacity,scale] duration-300 ease-bounce" enter-from-class="opacity-0 scale-50" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
                        <HugeiconsIcon :key="String(copied)" :icon="copied ? Tick02Icon : Link01Icon" class="size-4" />
                    </Transition>
                </button>
            </div>
        </div>

        <!-- Mobile view (floating bar at bottom) -->
        <div class="fixed bottom-4 left-1/2 z-20 -translate-x-1/2 animate-[uv-fade-up_0.7s_var(--ease-out-expo)_0.8s_both] xl:hidden">
            <div class="flex items-center gap-2 rounded border border-border bg-card p-2 shadow-elevated-sm">
                <!-- Social share links (mobile) -->
                <a v-for="platform in socialPlatforms" :key="platform.name" :href="platform.url" target="_blank" rel="noopener noreferrer" :aria-label="platform.label" :class="[buttonClasses, platform.color]">
                    <HugeiconsIcon :icon="platform.icon" class="size-4" />
                </a>

                <!-- Copy link -->
                <button type="button" :aria-label="copied ? t('uiVintage.blog.share.copied') : t('uiVintage.blog.share.copy')" :class="[buttonClasses, 'hover:border-primary hover:bg-primary hover:text-primary-foreground!', copied && 'border-primary text-primary']" @click="copyLink">
                    <HugeiconsIcon :icon="copied ? Tick02Icon : Link01Icon" class="size-4" />
                </button>
            </div>
        </div>
    </Teleport>
</template>