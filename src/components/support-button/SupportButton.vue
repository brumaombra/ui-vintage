<script setup lang="ts">
import ArrowUpRight01Icon from '@hugeicons/core-free-icons/ArrowUpRight01Icon';
import { HugeiconsIcon } from '@hugeicons/vue';
import { computed } from 'vue';
import type { HTMLAttributes } from 'vue';
import { useI18n } from 'vue-i18n';
import { buttonVariants } from '../ui/button';
import { getButtonVariantClasses } from '../../lib/color-tokens';
import { cn } from '../../lib/utils';
import { supportPlatforms, type SupportPlatform } from './platforms';

// Props
const props = withDefaults(defineProps<{
	platform: SupportPlatform;
	username?: string;
	href?: string;
	variant?: 'outline' | 'solid' | 'classic' | 'split' | 'card';
	size?: 'sm' | 'default' | 'lg';
	iconOnly?: boolean;
	label?: string;
	description?: string;
	class?: HTMLAttributes['class'];
}>(), {
	username: '',
	href: '',
	variant: 'outline',
	size: 'default',
	iconOnly: false,
	label: '',
	description: ''
});

const { t } = useI18n();

// Brand data of the platform
const brand = computed(() => supportPlatforms[props.platform]);

// Link to the creator page (an explicit href wins over the username)
const link = computed(() => props.href || (props.username ? brand.value.url(props.username) : ''));

// Texts: the button label, and the card title and description
const resolvedLabel = computed(() => props.label || t(`uiVintage.supportButton.${props.platform}.label`));
const cardTitle = computed(() => props.label || t(`uiVintage.supportButton.${props.platform}.title`));
const cardDescription = computed(() => props.description || t(`uiVintage.supportButton.${props.platform}.description`));

// Accessible name, also telling screen readers that the page opens in a new tab
const ariaLabel = computed(() => `${props.variant === 'card' ? cardTitle.value : resolvedLabel.value} (${t('uiVintage.supportButton.newTab')})`);

// Brand colors as CSS variables, so the dark theme can swap the classic Patreon black for white
const brandStyle = computed(() => ({
	'--uv-support-brand': brand.value.color,
	'--uv-support-classic': brand.value.classicColor,
	'--uv-support-classic-foreground': brand.value.classicForeground,
	'--uv-support-classic-dark': brand.value.classicDarkColor || brand.value.classicColor,
	'--uv-support-classic-dark-foreground': brand.value.classicDarkForeground || brand.value.classicForeground
}));

// The Ko-fi heart: the surface color behind it (so it reads as a cutout), red on the classic button, brand on the bare outline mark
const heartFill = computed(() => {
	if (props.variant === 'classic') return brand.value.heartColor;
	return 'var(--uv-support-brand)';
});

// Sizes of the brand tile, the split stripe, and the mark
const tileClasses = { sm: 'size-6', default: 'size-7', lg: 'size-8' };
const stripeClasses = { sm: 'w-10', default: 'w-12', lg: 'w-13' };
const markClasses = { sm: 'size-3.5', default: 'size-4', lg: 'size-[18px]' };
const iconOnlyClasses = { sm: 'size-10', default: 'size-12', lg: 'size-[52px]' };

// Classes of the button (the card has its own layout)
const buttonClasses = computed(() => {
	// Surface of each look
	const surface = {
		outline: getButtonVariantClasses('secondary'),
		split: `${getButtonVariantClasses('secondary')} gap-3 overflow-hidden py-0 pl-0`,
		solid: 'bg-(--uv-support-brand) text-white shadow-elevated-sm hover:brightness-95',
		classic: 'bg-(--uv-support-classic) text-(--uv-support-classic-foreground) shadow-elevated-sm hover:brightness-95 dark:bg-(--uv-support-classic-dark) dark:text-(--uv-support-classic-dark-foreground)',
		card: ''
	}[props.variant];

	// Same sizes, press feedback, and focus ring as Button
	return cn(buttonVariants({ variant: null, size: props.size }), surface, props.iconOnly && cn(iconOnlyClasses[props.size], 'p-0'), props.class);
});
</script>

<template>
	<!-- Card: brand tile, title and description, and an arrow that nudges on hover -->
	<a v-if="props.variant === 'card'" :href="link" target="_blank" rel="noopener noreferrer" :aria-label="ariaLabel" :style="brandStyle" :class="cn(
		'group/support flex items-center gap-4 rounded border border-border bg-card p-4 text-card-foreground shadow-elevated-sm outline-none',
		'transition-[border-color,box-shadow,translate] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elevated-md focus-visible:ring-[3px] focus-visible:ring-ring/45',
		props.class
	)">
		<!-- Brand tile -->
		<span class="grid size-11 shrink-0 place-items-center rounded bg-(--uv-support-brand) text-white">
			<svg viewBox="0 0 24 24" class="size-6" aria-hidden="true">
				<path :d="brand.path" fill="currentColor" />
				<path v-if="brand.heartPath" :d="brand.heartPath" :fill="heartFill" />
			</svg>
		</span>

		<!-- Title and description -->
		<span class="min-w-0 flex-1">
			<span class="block truncate text-sm font-semibold"><slot>{{ cardTitle }}</slot></span>
			<span class="mt-0.5 block truncate text-xs text-muted-foreground">{{ cardDescription }}</span>
		</span>

		<!-- External link arrow -->
		<HugeiconsIcon :icon="ArrowUpRight01Icon" class="size-4 shrink-0 text-muted-foreground transition-[translate,color] duration-300 ease-out-expo group-hover/support:translate-x-0.5 group-hover/support:-translate-y-0.5 group-hover/support:text-foreground" />
	</a>

	<!-- Button: outline (brand tile), split (brand stripe), solid, or classic -->
	<a v-else :href="link" target="_blank" rel="noopener noreferrer" :aria-label="ariaLabel" :style="brandStyle" :class="buttonClasses">
		<!-- Brand stripe along the left edge -->
		<span v-if="props.variant === 'split' && !props.iconOnly" :class="cn('grid shrink-0 place-items-center self-stretch bg-(--uv-support-brand) text-white', stripeClasses[props.size])">
			<svg viewBox="0 0 24 24" :class="markClasses[props.size]" aria-hidden="true">
				<path :d="brand.path" fill="currentColor" />
				<path v-if="brand.heartPath" :d="brand.heartPath" :fill="heartFill" />
			</svg>
		</span>

		<!-- Brand tile next to the label -->
		<span v-else-if="props.variant === 'outline' && !props.iconOnly" :class="cn('grid shrink-0 place-items-center rounded bg-(--uv-support-brand) text-white', tileClasses[props.size])">
			<svg viewBox="0 0 24 24" :class="markClasses[props.size]" aria-hidden="true">
				<path :d="brand.path" fill="currentColor" />
				<path v-if="brand.heartPath" :d="brand.heartPath" :fill="heartFill" />
			</svg>
		</span>

		<!-- Bare mark: white on solid, classic colors on classic, brand colored on the icon-only outline and split buttons -->
		<svg v-else viewBox="0 0 24 24" :class="cn(props.iconOnly ? 'size-5' : markClasses[props.size], (props.variant === 'outline' || props.variant === 'split') && 'text-(--uv-support-brand)')" aria-hidden="true">
			<path :d="brand.path" fill="currentColor" />
			<path v-if="brand.heartPath" :d="brand.heartPath" :fill="heartFill" />
		</svg>

		<!-- Label -->
		<span v-if="!props.iconOnly"><slot>{{ resolvedLabel }}</slot></span>
	</a>
</template>