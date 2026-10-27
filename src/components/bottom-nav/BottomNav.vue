<script setup lang="ts">
import { NuxtLinkLocale } from '#components';
import type { HTMLAttributes } from 'vue';
import { useI18n } from 'vue-i18n';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import type { HugeiconsIconDefinition } from '../../lib/common-types';

// Props (item paths are localized by the links, external URLs work too)
const props = defineProps<{
	items: Array<{
		id: string;
		label: string;
		icon?: HugeiconsIconDefinition | null;
		to: string;
		active?: boolean;
		primary?: boolean;
	}>;
	class?: HTMLAttributes['class'];
}>();

const { t } = useI18n();
</script>

<template>
	<!-- Bottom navigation for phones, fixed to the bottom edge (hidden from the md breakpoint, where a sidebar takes over) -->
	<nav :aria-label="t('uiVintage.bottomNav.label')" :class="cn('fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden', props.class)">
		<ul class="flex h-16 items-stretch px-2">
			<li v-for="item in props.items" :key="item.id" class="flex flex-1 justify-center">
				<!-- Primary item: the main action as a primary icon button, its label for screen readers only -->
				<div v-if="item.primary" class="flex items-center">
					<Button :to="item.to" variant="primary" size="icon" :aria-label="item.label" :aria-current="item.active ? 'page' : undefined">
						<HugeiconsIcon v-if="item.icon" :icon="item.icon" class="size-6" :stroke-width="2" />
					</Button>
				</div>

				<!-- Other items: icon and label, the whole column is the tap area (the active one is marked like the sidebar: readable text and a primary bar) -->
				<NuxtLinkLocale v-else :to="item.to" :aria-current="item.active ? 'page' : undefined" :class="cn('relative flex w-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors duration-150', 'before:absolute before:inset-x-5 before:top-0 before:h-0.5 before:rounded-full before:bg-primary before:transition-transform before:duration-300 before:ease-spring', item.active ? 'text-foreground before:scale-x-100' : 'text-muted-foreground before:scale-x-0 hover:text-foreground')">
					<HugeiconsIcon v-if="item.icon" :icon="item.icon" class="size-5" :stroke-width="item.active ? 2 : 1.6" />
					{{ item.label }}
				</NuxtLinkLocale>
			</li>
		</ul>
	</nav>
</template>