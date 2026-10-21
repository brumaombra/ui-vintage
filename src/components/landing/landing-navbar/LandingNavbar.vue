<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { HTMLAttributes } from 'vue';
import { useI18n } from 'vue-i18n';
import BlogProgressBar from '../../blog/BlogProgressBar.vue';
import LogoImage from '../../logo-image/LogoImage.vue';
import { cn } from '../../../lib/utils';

// Props
const props = withDefaults(defineProps<{
	appName?: string;
	appLogo?: string;
	appLogoDark?: string;
	appLinkTo?: string;
	logoClass?: HTMLAttributes['class'];
	class?: HTMLAttributes['class'];
	containerClass?: HTMLAttributes['class'];
	leftClass?: HTMLAttributes['class'];
	rightClass?: HTMLAttributes['class'];
	showProgress?: boolean;
}>(), {
	appName: '',
	appLogo: '',
	appLogoDark: '',
	appLinkTo: '/',
	showProgress: false
});

const SCROLL_THRESHOLD_PX = 12;
const isScrolled = ref(false);

// Float the navbar once the page leaves the top
const handleScroll = () => {
	isScrolled.value = window.scrollY > SCROLL_THRESHOLD_PX;
};

// On component mounted
onMounted(() => {
	handleScroll();
	window.addEventListener('scroll', handleScroll, { passive: true });
});

// On before component unmount
onBeforeUnmount(() => {
	window.removeEventListener('scroll', handleScroll);
});

// Logo sources for each theme (either one falls back to the other)
const lightLogo = computed(() => props.appLogo || props.appLogoDark);
const darkLogo = computed(() => props.appLogoDark || props.appLogo);
const hasDarkLogo = computed(() => darkLogo.value !== lightLogo.value);

const { t } = useI18n();

// Logo alt text (also names the home link when the app name is not shown)
const logoAlt = computed(() => props.appName ? t('uiVintage.common.logo', { name: props.appName }) : t('uiVintage.common.home'));
</script>

<template>
	<!-- Transparent at the top of the page, a floating card once scrolled. The header keeps one height, so the page below never moves, and the card is its own layer that only fades and scales (no layout or repaint while it animates, which made phones stutter) -->
	<header :data-scrolled="isScrolled ? '' : undefined" :class="cn('sticky top-0 z-30 h-20 w-full text-card-foreground', props.class)">
		<!-- Floating card behind the content, with the reading progress along its bottom edge (clipped to its rounded corners) -->
		<div class="pointer-events-none absolute inset-x-0 top-2 px-2 sm:px-4">
			<div :class="cn('relative mx-auto h-16 max-w-5xl origin-top overflow-hidden rounded border border-border bg-card shadow-elevated-md transition-[opacity,scale] duration-500 ease-out-expo motion-reduce:transition-none', isScrolled ? 'scale-100 opacity-100' : 'scale-[0.98] opacity-0')">
				<div v-if="props.showProgress" class="absolute inset-x-0 bottom-0">
					<BlogProgressBar />
				</div>
			</div>
		</div>

		<!-- Content, moving in to line up with the card (only the header lays out again while it does) -->
		<div :class="cn('relative h-full transition-[padding] duration-500 ease-out-expo motion-reduce:transition-none', isScrolled ? 'px-2 sm:px-4' : 'px-0')">
			<nav :class="cn('mx-auto flex h-full items-center justify-between px-3 transition-[max-width,padding] duration-500 ease-out-expo motion-reduce:transition-none sm:px-6 lg:px-8', isScrolled ? 'max-w-5xl sm:px-5 lg:px-5' : 'max-w-6xl', props.containerClass)">
				<!-- Left-aligned content -->
				<div :class="cn('flex items-center', props.leftClass)">
					<slot name="left">
						<!-- Home link (the path is localized) -->
						<NuxtLinkLocale v-if="lightLogo || props.appName" :to="props.appLinkTo" class="inline-flex items-center gap-2 transition-opacity duration-150 hover:opacity-80">
							<!-- App logo -->
							<template v-if="lightLogo">
								<LogoImage :src="lightLogo" :alt="logoAlt" :size="44" :sizes="{ 320: '44px', 640: '36px' }" loading="eager" fetchpriority="high" :class="cn('size-11 sm:size-9 shrink-0 object-contain', hasDarkLogo && 'dark:hidden', props.logoClass)" />
								<LogoImage v-if="hasDarkLogo" :src="darkLogo" :alt="logoAlt" :size="44" :sizes="{ 320: '44px', 640: '36px' }" loading="eager" :class="cn('hidden size-11 sm:size-9 shrink-0 object-contain dark:block', props.logoClass)" />
							</template>

							<!-- App name -->
							<span v-if="props.appName" class="hidden sm:inline! text-xl font-semibold tracking-tight text-foreground">
								{{ props.appName }}
							</span>
						</NuxtLinkLocale>
					</slot>
				</div>

				<!-- Right-aligned content -->
				<div :class="cn('flex items-center justify-end gap-2 sm:gap-3', props.rightClass)">
					<slot name="right" />
				</div>
			</nav>
		</div>
	</header>
</template>