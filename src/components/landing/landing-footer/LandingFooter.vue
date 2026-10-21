<script setup lang="ts">
import LogoImage from '../../logo-image/LogoImage.vue';
import FavouriteIcon from '@hugeicons/core-free-icons/FavouriteIcon';
import { HugeiconsIcon } from '@hugeicons/vue';
import { computed, type HTMLAttributes } from 'vue';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';
import type { HeadingLevel } from '../../../lib/common-types';

// Footer link (the path is localized by the link, external URLs work too)
export interface LandingFooterLink {
	id: string;
	label: string;
	to: string;
	newTab?: boolean;
}

export interface LandingFooterSection {
	id: string;
	title: string;
	links: LandingFooterLink[];
}

// Props
const props = withDefaults(defineProps<{
	appName: string;
	appLogo?: string;
	appLogoDark?: string;
	appLinkTo?: string;
	logoClass?: HTMLAttributes['class'];
	appDescription?: string;
	sections?: LandingFooterSection[];
	authorName?: string;
	authorLink?: string;
	year?: number;
	showBottomBar?: boolean;
	level?: HeadingLevel;
	class?: HTMLAttributes['class'];
	containerClass?: HTMLAttributes['class'];
	brandClass?: HTMLAttributes['class'];
	sectionsClass?: HTMLAttributes['class'];
	bottomBarClass?: HTMLAttributes['class'];
}>(), {
	appLinkTo: '/',
	appDescription: '',
	sections: () => [],
	authorName: '',
	authorLink: '',
	year: () => new Date().getFullYear(),
	showBottomBar: true,
	level: 2
});

const { t } = useI18n();
const logoAlt = computed(() => props.appName ? t('uiVintage.common.logo', { name: props.appName }) : t('uiVintage.common.home'));
const hasSingleSection = computed(() => props.sections.length === 1);

// Get the link props (new tab links open in a separate, unlinked tab)
const getLinkProps = (link: LandingFooterLink) => {
	return {
		to: link.to,
		...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})
	};
};

// Logo sources for each theme (either one falls back to the other)
const lightLogo = computed(() => props.appLogo || props.appLogoDark || '');
const darkLogo = computed(() => props.appLogoDark || props.appLogo || '');
const hasDarkLogo = computed(() => darkLogo.value !== lightLogo.value);
</script>

<template>
	<footer :class="cn('relative z-10 border-t border-border bg-card', props.class)">
		<!-- Same width and padding as the landing content, so the footer lines up with the page -->
		<div :class="cn('mx-auto max-w-6xl px-3 py-12 sm:px-6 lg:px-8', props.containerClass)">
			<div :class="cn('flex flex-col gap-8 md:flex-row md:items-start md:justify-between')">
				<!-- Brand section -->
				<div :class="cn('max-w-md flex-1', props.brandClass)">
					<!-- App logo and name (home link, the path is localized) -->
					<NuxtLinkLocale :to="props.appLinkTo" class="mb-4 inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground transition-opacity duration-150 hover:opacity-80">
						<template v-if="lightLogo">
							<LogoImage :src="lightLogo" :alt="logoAlt" :size="32" :sizes="{ 320: '32px', 1280: '32px' }" loading="lazy" :class="cn('size-8 shrink-0 object-contain', hasDarkLogo && 'dark:hidden', props.logoClass)" />
							<LogoImage v-if="hasDarkLogo" :src="darkLogo" :alt="logoAlt" :size="32" :sizes="{ 320: '32px', 1280: '32px' }" loading="lazy" :class="cn('hidden size-8 shrink-0 object-contain dark:block', props.logoClass)" />
						</template>
						<span>{{ props.appName }}</span>
					</NuxtLinkLocale>

					<!-- App description -->
					<p v-if="props.appDescription" class="max-w-sm text-xs md:text-sm leading-relaxed text-muted-foreground">
						{{ props.appDescription }}
					</p>
				</div>

				<!-- Single link section -->
				<div v-if="hasSingleSection" :class="cn('min-w-0 md:flex md:justify-end', props.sectionsClass)">
					<div class="md:text-right">
						<!-- Section title -->
						<component :is="`h${props.level}`" class="mb-4 font-semibold text-foreground">
							{{ props.sections[0]?.title }}
						</component>

						<!-- Section links -->
						<ul class="space-y-3 text-xs sm:text-sm">
							<li v-for="link in props.sections[0]?.links" :key="link.id">
								<NuxtLinkLocale v-bind="getLinkProps(link)" class="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat text-muted-foreground transition-[color,background-size] duration-300 ease-out-expo hover:bg-[length:100%_1px] hover:text-primary">
									{{ link.label }}
								</NuxtLinkLocale>
							</li>
						</ul>
					</div>
				</div>

				<!-- Link sections -->
				<div v-else class="flex flex-col gap-8 md:max-w-[60%] md:flex-row md:flex-wrap md:justify-end md:gap-16">
					<div v-for="section in props.sections" :key="section.id" :class="cn('min-w-28', props.sectionsClass)">
						<!-- Section title -->
						<component :is="`h${props.level}`" class="mb-4 font-semibold text-foreground">
							{{ section.title }}
						</component>

						<!-- Section links -->
						<ul class="space-y-3 text-xs sm:text-sm">
							<li v-for="link in section.links" :key="link.id">
								<NuxtLinkLocale v-bind="getLinkProps(link)" class="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat text-muted-foreground transition-[color,background-size] duration-300 ease-out-expo hover:bg-[length:100%_1px] hover:text-primary">
									{{ link.label }}
								</NuxtLinkLocale>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- Bottom bar -->
			<div v-if="props.showBottomBar" :class="cn('mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs md:text-sm text-muted-foreground md:flex-row', props.bottomBarClass)">
				<!-- Copyright -->
				<div>
					&copy; {{ props.year }} {{ props.appName }}. {{ t('uiVintage.footer.allRightsReserved') }}
				</div>

				<!-- Author -->
				<div v-if="props.authorName && props.authorLink" class="flex flex-wrap items-center justify-center gap-1.5 md:justify-end">
					<span>{{ t('uiVintage.footer.madeWith') }}</span>
					<HugeiconsIcon :icon="FavouriteIcon" class="size-4 shrink-0 text-destructive" />
					<span>{{ t('uiVintage.footer.by') }}</span>
					<a :href="props.authorLink" target="_blank" rel="noopener noreferrer" class="font-semibold text-foreground hover:underline">
						{{ props.authorName }}
					</a>
				</div>
			</div>
		</div>
	</footer>
</template>