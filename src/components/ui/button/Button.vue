<script setup lang="ts">
import { NuxtLinkLocale } from '#components';
import type { PrimitiveProps } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import type { ButtonVariants } from '.';
import { Primitive } from 'reka-ui';
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
	class?: HTMLAttributes['class'];
}>(), {
	as: 'button',
	loading: false,
	disabled: false
});

// Disabled or loading: the button can't be pressed (or followed, for a navigation button)
const isInactive = computed(() => props.disabled || props.loading);

// Element to render: a localized link for navigation buttons (a plain span while inactive, so it can't be followed), otherwise the as element
const element = computed(() => {
	if (!props.to) return props.as;
	return isInactive.value ? 'span' : NuxtLinkLocale;
});
</script>

<template>
	<Primitive data-slot="button" :data-variant="variant" :data-size="size" :data-loading="props.loading ? '' : undefined" :aria-busy="props.loading || undefined" :disabled="(!props.to && isInactive) || undefined" :aria-disabled="(props.to && isInactive) || undefined" :to="props.to && !isInactive ? props.to : undefined" :as="element" :as-child="asChild" :class="cn(buttonVariants({ variant, size }), props.class)">
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
		</template>
	</Primitive>
</template>