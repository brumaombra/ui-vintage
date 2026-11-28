<script setup lang="ts">
import type { DateValue } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { CalendarDate, fromDate, getLocalTimeZone, toCalendarDate, today } from '@internationalized/date';
import ArrowDown01Icon from '@hugeicons/core-free-icons/ArrowDown01Icon';
import ArrowLeft01Icon from '@hugeicons/core-free-icons/ArrowLeft01Icon';
import ArrowRight01Icon from '@hugeicons/core-free-icons/ArrowRight01Icon';
import { HugeiconsIcon } from '@hugeicons/vue';
import { computed, nextTick, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';
import { buttonVariants } from '../button';
import { Calendar } from '../calendar';

// Props (the day as a Date at midnight of the visitor's time zone, the days before minDate or after maxDate can't be picked)
const props = withDefaults(defineProps<{
	modelValue?: Date | null;
	minDate?: Date | null;
	maxDate?: Date | null;
	locale?: string;
	class?: HTMLAttributes['class'];
}>(), {
	modelValue: null,
	minDate: null,
	maxDate: null,
	locale: undefined
});

// Emits
const emits = defineEmits<{
	(e: 'update:modelValue', payload: Date | null): void;
}>();

// Years on a page of the year grid (four rows of three)
const YEARS_PER_PAGE = 12;

const localTimeZone = getLocalTimeZone();

// Follow the app language unless a locale is passed explicitly (like the calendar)
const { t, locale: appLocale } = useI18n();
const resolvedLocale = computed(() => props.locale || appLocale.value || 'en');

// A Date as a day of the calendar (none for a missing or invalid date)
const toCalendarValue = (date: Date | null | undefined): DateValue | undefined => {
	if (!(date instanceof Date) || Number.isNaN(date.getTime())) return undefined;
	return toCalendarDate(fromDate(date, localTimeZone));
};

// The picked day, and the limits
const calendarValue = computed(() => toCalendarValue(props.modelValue));
const minValue = computed(() => toCalendarValue(props.minDate));
const maxValue = computed(() => toCalendarValue(props.maxDate));

// The view: the days of a month, or the grids that jump to another year and month (opened from the month title)
const view = ref<'days' | 'years' | 'months'>('days');
const rootElement = ref<HTMLElement | null>(null);

// The month shown: the picked day's (also when it is picked from outside, e.g. a quick pick in the next month), today's when there is none
const placeholder = shallowRef<DateValue>(calendarValue.value ?? minValue.value ?? today(localTimeZone));
watch(calendarValue, value => {
	if (!value) return;
	placeholder.value = value;
	view.value = 'days'; // A day picked from outside shows its month
});

// Pick a day (a Date at midnight of that day)
const handlePick = (value: DateValue | undefined) => {
	emits('update:modelValue', value ? new Date(value.year, value.month - 1, value.day) : null);
};

/******************************** Months and years ********************************/

// A month as one number, to compare it with the limits
const toMonthIndex = (year: number, month: number) => year * 12 + month - 1;

// Check whether a month or a year has no day that can be picked
const isMonthOutside = (year: number, month: number) => {
	const monthIndex = toMonthIndex(year, month);
	if (minValue.value && monthIndex < toMonthIndex(minValue.value.year, minValue.value.month)) return true;
	return !!maxValue.value && monthIndex > toMonthIndex(maxValue.value.year, maxValue.value.month);
};
const isYearOutside = (year: number) => (!!minValue.value && year < minValue.value.year) || (!!maxValue.value && year > maxValue.value.year);

// Show a month (moved inside the limits, so the year of the minimum shows its first month that can be picked)
const showMonth = (year: number, month: number) => {
	let monthIndex = toMonthIndex(year, month);
	if (minValue.value) monthIndex = Math.max(monthIndex, toMonthIndex(minValue.value.year, minValue.value.month));
	if (maxValue.value) monthIndex = Math.min(monthIndex, toMonthIndex(maxValue.value.year, maxValue.value.month));
	placeholder.value = new CalendarDate(Math.floor(monthIndex / 12), (monthIndex % 12) + 1, 1);
};

// The first year of the page that holds a year (pages start at the minimum's year, or end at the maximum's, so the allowed years fill them)
const getPageStart = (year: number) => {
	const anchorYear = minValue.value?.year ?? (maxValue.value ? maxValue.value.year - YEARS_PER_PAGE + 1 : year);
	const offset = (((year - anchorYear) % YEARS_PER_PAGE) + YEARS_PER_PAGE) % YEARS_PER_PAGE; // Positive also for the years before the anchor
	return year - offset;
};

// The years of the page shown
const pageStart = ref(getPageStart(placeholder.value.year));
const pageYears = computed(() => Array.from({ length: YEARS_PER_PAGE }, (_, index) => pageStart.value + index));
const currentYear = today(localTimeZone).year;

// The names shown: the month and year of the title, the year range of a page, the short months of the grid
const formatTitle = (date: DateValue) => new Intl.DateTimeFormat(resolvedLocale.value, { month: 'long', year: 'numeric' }).format(new Date(date.year, date.month - 1, 1));
const formatShortMonth = (month: number) => new Intl.DateTimeFormat(resolvedLocale.value, { month: 'short' }).format(new Date(2000, month - 1, 1));

// Move the focus into the new view (the picked year or month, or the title), so the keyboard doesn't fall back to the page
const focusView = async () => {
	await nextTick();
	const target = rootElement.value?.querySelector<HTMLElement>('[data-current]') ?? rootElement.value?.querySelector<HTMLElement>('[data-slot="inline-date-picker-title"]');
	target?.focus();
};

// Open the year grid on the page of the year shown
const openYears = () => {
	pageStart.value = getPageStart(placeholder.value.year);
	view.value = 'years';
	focusView();
};

// Open the month grid of the year shown
const openMonths = () => {
	view.value = 'months';
	focusView();
};

// Go back to the days of the month shown
const openDays = () => {
	view.value = 'days';
	focusView();
};

// Pick a year: its months come next
const handleYearPick = (year: number) => {
	showMonth(year, placeholder.value.month);
	openMonths();
};

// Pick a month: its days come next
const handleMonthPick = (month: number) => {
	showMonth(placeholder.value.year, month);
	openDays();
};

// Move the year grid by a page, or the month grid by a year
const handlePrevious = () => {
	if (view.value === 'years') {
		pageStart.value -= YEARS_PER_PAGE;
	} else {
		showMonth(placeholder.value.year - 1, placeholder.value.month);
	}
};
const handleNext = () => {
	if (view.value === 'years') {
		pageStart.value += YEARS_PER_PAGE;
	} else {
		showMonth(placeholder.value.year + 1, placeholder.value.month);
	}
};

// Whether the arrows lead anywhere (a page or a year with nothing to pick is left out)
const isPreviousDisabled = computed(() => view.value === 'years' ? isYearOutside(pageStart.value - 1) : isYearOutside(placeholder.value.year - 1));
const isNextDisabled = computed(() => view.value === 'years' ? isYearOutside(pageStart.value + YEARS_PER_PAGE) : isYearOutside(placeholder.value.year + 1));

// The arrows and the title of the grids, like the ones of the calendar
const navButtonClass = cn(buttonVariants({ variant: 'secondary' }), 'size-10 min-h-10 border-transparent bg-transparent p-0 text-muted-foreground shadow-none hover:bg-accent hover:text-foreground');
const titleButtonClass = 'inline-flex h-10 cursor-pointer items-center gap-1 rounded px-3 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45';

// The cells of the grids: as tall as the days, the picked one filled, this year ringed
const cellClass = cn(buttonVariants({ variant: 'ghost' }), 'h-12 w-full font-mono text-sm font-normal tabular-nums disabled:opacity-35 data-current:bg-primary data-current:font-bold data-current:text-primary-foreground data-current:hover:bg-primary data-today:font-bold data-today:text-primary data-today:ring-1 data-today:ring-primary/60 data-today:ring-inset');
</script>

<template>
	<!-- An always open calendar, its days filling the width; the month title opens a grid of years, then of months -->
	<div ref="rootElement" data-slot="inline-date-picker" :data-view="view" :class="props.class">
		<!-- The years, then the months of the year picked -->
		<div v-if="view !== 'days'" data-slot="inline-date-picker-grid" class="flex flex-col">
			<div class="relative flex h-10 items-center justify-center">
				<nav class="absolute inset-x-0 top-0 flex items-center justify-between">
					<button type="button" :class="navButtonClass" :disabled="isPreviousDisabled" :aria-label="view === 'years' ? t('uiVintage.datePicker.previousYears') : t('uiVintage.datePicker.previousYear')" @click="handlePrevious">
						<HugeiconsIcon :icon="ArrowLeft01Icon" class="size-4" />
					</button>
					<button type="button" :class="navButtonClass" :disabled="isNextDisabled" :aria-label="view === 'years' ? t('uiVintage.datePicker.nextYears') : t('uiVintage.datePicker.nextYear')" @click="handleNext">
						<HugeiconsIcon :icon="ArrowRight01Icon" class="size-4" />
					</button>
				</nav>
				<button type="button" data-slot="inline-date-picker-title" :class="cn(titleButtonClass, 'relative font-mono tabular-nums')" :aria-label="view === 'years' ? t('uiVintage.datePicker.showDays') : t('uiVintage.datePicker.chooseYear')" @click="view === 'years' ? openDays() : openYears()">
					<span aria-live="polite">{{ view === 'years' ? `${pageYears[0]} – ${pageYears[YEARS_PER_PAGE - 1]}` : placeholder.year }}</span>
					<HugeiconsIcon :icon="ArrowDown01Icon" :class="cn('size-4 text-muted-foreground transition-[rotate] duration-200', view === 'years' && 'rotate-180')" />
				</button>
			</div>

			<div class="mt-4 grid grid-cols-3 gap-2">
				<template v-if="view === 'years'">
					<button v-for="year in pageYears" :key="year" type="button" data-slot="inline-date-picker-year" :class="cellClass" :disabled="isYearOutside(year)" :data-current="year === placeholder.year ? '' : undefined" :data-today="year === currentYear && year !== placeholder.year ? '' : undefined" :aria-pressed="year === placeholder.year" @click="handleYearPick(year)">
						{{ year }}
					</button>
				</template>
				<template v-else>
					<button v-for="month in 12" :key="month" type="button" data-slot="inline-date-picker-month" :class="cn(cellClass, 'font-sans')" :disabled="isMonthOutside(placeholder.year, month)" :data-current="month === placeholder.month ? '' : undefined" :aria-pressed="month === placeholder.month" @click="handleMonthPick(month)">
						{{ formatShortMonth(month) }}
					</button>
				</template>
			</div>
		</div>

		<!-- The days of the month shown -->
		<Calendar v-else :model-value="calendarValue" :placeholder="placeholder" :min-value="minValue" :max-value="maxValue" :locale="props.locale" fluid weekday-format="narrow" class="p-0" @update:model-value="handlePick" @update:placeholder="value => placeholder = value">
			<template #calendar-heading="{ date }">
				<button type="button" data-slot="inline-date-picker-title" :class="cn(titleButtonClass, 'relative z-10')" :aria-label="t('uiVintage.datePicker.chooseMonthAndYear', { month: formatTitle(date) })" @click="openYears">
					<span aria-live="polite">{{ formatTitle(date) }}</span>
					<HugeiconsIcon :icon="ArrowDown01Icon" class="size-4 text-muted-foreground" />
				</button>
			</template>
		</Calendar>
	</div>
</template>