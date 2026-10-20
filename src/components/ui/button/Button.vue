<script setup lang="ts">
import { NuxtLinkLocale } from '#components';
import type { PrimitiveProps } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import type { ButtonVariants } from '.';
import { Primitive } from 'reka-ui';
import { getSurfaceToneClasses } from '../../../lib/color-tokens';
import { cn } from '../../../lib/utils';
import { Spinner } from '../spinner';
import { buttonVariants } from '.';

// Props
const props = withDefaults(defineProps<PrimitiveProps & {
	variant?: ButtonVariants['variant'];
	size?: ButtonVariants['size'];
	loading?: boolean;
	disabled?: boolean;
	to?: string;
	count?: number | null;
	countMax?: number;
	class?: HTMLAttributes['class'];
}>(), {
	as: 'button',
	loading: false,
	disabled: false,
	count: null,
	countMax: 99
});

// Disabled or loading: the button can't be pressed (or followed, for a navigation button)
const isInactive = computed(() => props.disabled || props.loading);

// Same-page anchor (like #setup): a plain link, since there is no route to localize
const isAnchor = computed(() => !!props.to?.startsWith('#'));

// Element to render: a localized link for navigation buttons (a plain anchor for same-page links, a span while inactive so it can't be followed), otherwise the as element
const element = computed(() => {
	if (!props.to) return props.as;
	if (isInactive.value) return 'span';
	return isAnchor.value ? 'a' : NuxtLinkLocale;
});

// Notification count shown in a badge on the corner (capped, like 99+)
const hasCount = computed(() => !props.asChild && typeof props.count === 'number' && props.count > 0);
const countText = computed(() => props.count && props.count > props.countMax ? `${props.countMax}+` : String(props.count));

// Link attribute for the rendered element (href for a plain anchor, to for the localized link)
const linkAttributes = computed(() => {
	if (!props.to || isInactive.value) return {};
	return isAnchor.value ? { href: props.to } : { to: props.to };
});
</script>

<template>
	<Primitive data-slot="button" :data-variant="variant" :data-size="size" :data-loading="props.loading ? '' : undefined" :aria-busy="props.loading || undefined" :disabled="(!props.to && isInactive) || undefined" :aria-disabled="(props.to && isInactive) || undefined" v-bind="linkAttributes" :as="element" :as-child="asChild" :class="cn(buttonVariants({ variant, size }), hasCount && 'overflow-visible', props.class)">
		<!-- As-child buttons delegate rendering to the slotted element -->
		<slot v-if="asChild" />

		<template v-else>
			<!-- Content (kept in the layout while loading so the width never jumps) -->
			<span v-if="props.loading" class="invisible contents">
				<slot />
			</span>
			<slot v-else />

			<!-- Loading indicator -->
			<span v-if="props.loading" class="absolute inset-0 flex items-center justify-center">
				<Spinner size="sm" />
			</span>

			<!-- Notification count: a soft badge on an opaque backing (so the tint never shows the button through), its digits trimmed to the cap height so they sit centered in any font -->
			<span v-if="hasCount" data-slot="button-count" class="pointer-events-none absolute -top-2 -right-2 z-10 flex rounded bg-background">
				<span :class="cn('flex h-5 min-w-5 items-center justify-center rounded px-1 font-mono text-[0.6875rem] font-semibold leading-none tabular-nums', getSurfaceToneClasses('red'))">
					<span class="[text-box:trim-both_cap_alphabetic]">{{ countText }}</span>
				</span>
			</span>
		</template>
	</Primitive>
</template>