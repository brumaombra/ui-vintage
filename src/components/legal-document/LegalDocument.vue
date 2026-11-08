<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ArrowDown01Icon from '@hugeicons/core-free-icons/ArrowDown01Icon';
import ArrowUp01Icon from '@hugeicons/core-free-icons/ArrowUp01Icon';
import Calendar03Icon from '@hugeicons/core-free-icons/Calendar03Icon';
import CheckmarkCircle02Icon from '@hugeicons/core-free-icons/CheckmarkCircle02Icon';
import { HugeiconsIcon } from '@hugeicons/vue';
import type { HugeiconsIconDefinition } from '../../lib/common-types';
import { cn } from '../../lib/utils';
import { Accordion } from '../ui/accordion';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

// A point inside a section (a rule, a kind of data, a kind of cookie...)
export interface LegalDocumentPoint {
	title: string;
	text: string;
}

// A section of the document: a text, points, or both
export interface LegalDocumentSection {
	title: string;
	text?: string;
	points?: LegalDocumentPoint[];
	icon?: HugeiconsIconDefinition;
}

// Props
const props = withDefaults(defineProps<{
	title: string; // The h1 of the page
	updated?: string; // When it last changed, already formatted ("November 1, 2026")
	summary?: string[]; // The short version: a few plain sentences shown first
	sections: LegalDocumentSection[]; // The full text, one collapsible section each
	contactText?: string; // A line before the contact email
	contactEmail?: string;
	class?: HTMLAttributes['class'];
}>(), {
	updated: '',
	summary: () => [],
	contactText: '',
	contactEmail: ''
});

const { t } = useI18n();

// Which sections are open (all closed at first: the short version comes first)
const openSections = ref<boolean[]>(props.sections.map(() => false));
watch(() => props.sections.length, length => { openSections.value = Array.from({ length }, (_, index) => openSections.value[index] ?? false); });

// Open or close them all at once, so the full text is one tap away
const allOpen = computed(() => openSections.value.length > 0 && openSections.value.every(Boolean));
const toggleAll = () => {
	const open = !allOpen.value;
	openSections.value = openSections.value.map(() => open);
};
</script>

<template>
	<!-- Legal document: the title and the date, the short version, then the full text in collapsible sections (always in the page, for search engines and the browser's search) -->
	<div data-slot="legal-document" :class="cn('mx-auto w-full max-w-3xl space-y-4 md:space-y-6', props.class)">
		<!-- Title and date -->
		<header>
			<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{{ props.title }}</h1>
			<p v-if="props.updated" class="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
				<HugeiconsIcon :icon="Calendar03Icon" class="size-3.5 shrink-0" aria-hidden="true" />
				{{ t('uiVintage.legalDocument.updated', { date: props.updated }) }}
			</p>
		</header>

		<!-- The short version -->
		<Card v-if="props.summary.length" data-slot="legal-document-summary" padding="none" elevation="sm" class="border-primary/40 bg-primary/5 p-5 md:p-6">
			<!-- The label in the text color with an orange line, like the landing labels (orange text is only 2.2:1 on the light background) -->
			<h2 class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground"><span aria-hidden="true" class="h-px w-6 shrink-0 bg-primary" />{{ t('uiVintage.legalDocument.summary') }}</h2>
			<ul class="mt-3 space-y-2.5">
				<li v-for="point in props.summary" :key="point" class="flex items-start gap-2.5 text-xs leading-relaxed text-foreground md:text-sm">
					<HugeiconsIcon :icon="CheckmarkCircle02Icon" class="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
					<span>{{ point }}</span>
				</li>
			</ul>
		</Card>

		<!-- The full text -->
		<section class="space-y-2">
			<!-- Its label, and open or close every section -->
			<div class="flex items-center justify-between gap-3 pt-2">
				<h2 class="text-xs font-bold uppercase tracking-wider text-muted-foreground">{{ t('uiVintage.legalDocument.fullText') }}</h2>
				<Button variant="ghost" size="sm" class="text-muted-foreground" :aria-expanded="allOpen" @click="toggleAll">
					<HugeiconsIcon :icon="allOpen ? ArrowUp01Icon : ArrowDown01Icon" class="size-4" />
					{{ allOpen ? t('uiVintage.legalDocument.collapseAll') : t('uiVintage.legalDocument.expandAll') }}
				</Button>
			</div>

			<!-- Sections -->
			<Accordion v-for="(section, index) in props.sections" :key="section.title" v-model:open="openSections[index]" :title="section.title" :icon="section.icon">
				<p v-if="section.text" class="text-xs leading-relaxed text-muted-foreground md:text-sm">{{ section.text }}</p>
				<dl v-if="section.points?.length" :class="section.text ? 'mt-4 space-y-3' : 'space-y-3'">
					<div v-for="point in section.points" :key="point.title">
						<dt class="text-xs font-semibold text-foreground md:text-sm">{{ point.title }}</dt>
						<dd class="mt-0.5 text-xs leading-relaxed text-muted-foreground md:text-sm">{{ point.text }}</dd>
					</div>
				</dl>
			</Accordion>
		</section>

		<!-- Contact -->
		<p v-if="props.contactEmail" class="pt-2 text-center text-xs text-muted-foreground">
			{{ props.contactText }}
			<!-- Dark with an orange underline, which thickens on hover -->
			<a :href="`mailto:${props.contactEmail}`" class="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4 transition-[text-decoration-thickness] hover:decoration-[3px]">{{ props.contactEmail }}</a>
		</p>
	</div>
</template>