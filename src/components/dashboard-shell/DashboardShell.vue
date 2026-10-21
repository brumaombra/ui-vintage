<script setup lang="ts">
import LogoImage from '../logo-image/LogoImage.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { HTMLAttributes } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import BackgroundGrid from '../background-grid/BackgroundGrid.vue';
import { ThemeSelector } from '../theme-selector';
import { Separator } from '../ui/separator';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { cn } from '../../lib/utils';
import type { HugeiconsIconDefinition } from '../../lib/common-types';

// Props (item and home paths are localized by the links, external URLs work too)
const props = withDefaults(defineProps<{
	appName?: string;
	appLogo?: string;
	appLogoDark?: string;
	appLinkTo?: string;
	title?: string;
	description?: string;
	collapsible?: 'offcanvas' | 'icon' | 'none';
	compact?: boolean;
	sidebarSections?: Array<{
		id: string;
		label?: string;
		items: Array<{
			id: string;
			label: string;
			description?: string;
			icon?: HugeiconsIconDefinition | null;
			to: string;
			active?: boolean;
			newTab?: boolean;
		}>;
	}>;
	showBackground?: boolean;
	insetClass?: HTMLAttributes['class'];
	topbarClass?: HTMLAttributes['class'];
	contentContainerClass?: HTMLAttributes['class'];
}>(), {
	appName: '',
	appLogo: '',
	appLogoDark: '',
	appLinkTo: '/',
	title: '',
	description: '',
	collapsible: 'offcanvas',
	compact: false,
	sidebarSections: () => [],
	showBackground: true
});

// Get the link props of a sidebar item (new tab links open in a separate, unlinked tab)
const getSidebarItemLinkProps = (item: NonNullable<typeof props.sidebarSections>[number]['items'][number]) => {
	return {
		to: item.to,
		...(item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})
	};
};

const { t } = useI18n();

// Logo sources for each theme (either one falls back to the other)
const lightLogo = computed(() => props.appLogo || props.appLogoDark);
const darkLogo = computed(() => props.appLogoDark || props.appLogo);
const hasDarkLogo = computed(() => darkLogo.value !== lightLogo.value);

// Logo alt text (also names the home link when the app name is not shown)
const logoAlt = computed(() => props.appName ? t('uiVintage.common.logo', { name: props.appName }) : t('uiVintage.common.home'));
</script>

<template>
	<SidebarProvider>
		<!-- Sidebar -->
		<Sidebar :collapsible="props.collapsible" :compact="props.compact">
			<!-- Sidebar header -->
			<SidebarHeader v-if="props.appName || lightLogo || $slots['sidebar-header']" class="h-16 justify-center shadow-[inset_0_-1px_0_var(--sidebar-border)]">
				<slot name="sidebar-header">
					<SidebarMenu>
						<SidebarMenuItem>
							<!-- Home link (the path is localized) -->
							<SidebarMenuButton as-child size="lg">
								<NuxtLinkLocale :to="props.appLinkTo" class="inline-flex items-center gap-2">
									<div class="inline-flex items-center gap-2">
										<!-- App logo -->
										<template v-if="lightLogo">
											<LogoImage :src="lightLogo" :alt="logoAlt" :size="32" :sizes="{ 320: '32px', 1280: '32px' }" loading="eager" :class="['size-8 shrink-0 object-contain', hasDarkLogo && 'dark:hidden']" />
											<LogoImage v-if="hasDarkLogo" :src="darkLogo" :alt="logoAlt" :size="32" :sizes="{ 320: '32px', 1280: '32px' }" loading="eager" class="hidden size-8 shrink-0 object-contain dark:block" />
										</template>

										<!-- App name -->
										<span v-if="props.appName" class="text-xl font-semibold tracking-tight text-foreground">{{ props.appName }}</span>
									</div>
								</NuxtLinkLocale>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</slot>
			</SidebarHeader>

			<!-- Sidebar sections -->
			<SidebarContent v-if="props.sidebarSections.length">
				<SidebarGroup v-for="section in props.sidebarSections" :key="section.id" class="space-y-1">
					<!-- Section label -->
					<SidebarGroupLabel v-if="section.label">
						{{ section.label }}
					</SidebarGroupLabel>

					<!-- Section content -->
					<SidebarGroupContent>
						<SidebarMenu :class="cn('gap-1', props.compact && 'gap-0.5')">
							<SidebarMenuItem v-for="item in section.items" :key="item.id">
								<SidebarMenuButton as-child :is-active="item.active" :class="cn('group/nav relative h-auto min-h-11 overflow-hidden rounded px-3 py-2.5 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-foreground sm:px-3.5', 'before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:origin-center before:scale-y-0 before:bg-primary before:transition-transform before:duration-300 before:ease-spring data-[active=true]:before:scale-y-100', item.description ? 'items-start' : 'items-center')">
									<NuxtLinkLocale v-bind="getSidebarItemLinkProps(item)" :aria-current="item.active ? 'page' : undefined">
										<!-- Icon, centered on the capitals of the label (or of its first line, 1.25em tall): the line box alone centers it 0.08em too low, because of the space the font keeps for descenders (the size follows the label, 16px next to 14px text and about 14px next to the 12px compact text: a fixed 16px icon looked out of line beside the small labels; it is important, as the menu button sizes its direct svg children itself) -->
										<HugeiconsIcon v-if="item.icon" :icon="item.icon" :stroke-width="1.8" :class="cn('size-[1.143em]! shrink-0 opacity-90 transition-[opacity,color] duration-150 group-hover/nav:opacity-100 group-data-[active=true]/nav:text-primary', item.description ? 'mt-[calc((1.25em_-_16px)/2_-_0.08em)]' : 'self-center -translate-y-[0.08em]')" />

										<!-- Label and optional description -->
										<div :class="cn('min-w-0 flex-1 text-left leading-tight', item.description ? 'grid' : 'flex items-center')">
											<!-- Label -->
											<span class="truncate font-semibold">{{ item.label }}</span>

											<!-- Description -->
											<span v-if="item.description" class="mt-0.5 text-[11px] leading-4 text-sidebar-foreground/65">
												{{ item.description }}
											</span>
										</div>
									</NuxtLinkLocale>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<!-- Sidebar footer -->
			<SidebarFooter class="border-t border-sidebar-border">
				<slot name="sidebar-footer">
					<div class="flex items-center gap-2">
						<ThemeSelector />
					</div>
				</slot>
			</SidebarFooter>
		</Sidebar>

		<!-- Main shell -->
		<SidebarInset :class="cn('relative min-h-screen min-w-0 bg-background text-foreground', props.insetClass)">
			<!-- Background -->
			<BackgroundGrid v-if="props.showBackground" />

			<!-- Topbar (its bottom line is an inset shadow, so the whole 64px is free and the content centers on whole pixels) -->
			<header :class="cn('sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 shadow-[inset_0_-1px_0_var(--sidebar-border)] bg-sidebar/80 px-4 backdrop-blur-md backdrop-saturate-150', props.topbarClass)">
				<!-- Sidebar trigger -->
				<SidebarTrigger class="-ml-1" />

				<!-- Vertical separator -->
				<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />

				<!-- Optional custom content on the leading side of the topbar -->
				<slot name="topbar-leading" />

				<!-- Title and description -->
				<div class="min-w-0 flex-1">
					<!-- Title -->
					<div class="truncate text-sm font-semibold">
						{{ props.title }}
					</div>

					<!-- Description -->
					<div v-if="props.description" class="truncate text-xs text-muted-foreground">
						{{ props.description }}
					</div>
				</div>

				<!-- Optional custom content on the trailing side of the topbar -->
				<slot name="topbar-trailing" />
			</header>

			<!-- Main content -->
			<main class="relative z-10 min-w-0 flex-1">
				<div :class="cn('mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-6 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8', props.contentContainerClass)">
					<slot />
				</div>
			</main>

			<!-- Full-width footer -->
			<footer v-if="$slots.footer" class="relative z-10 mt-auto">
				<slot name="footer" />
			</footer>
		</SidebarInset>
	</SidebarProvider>
</template>